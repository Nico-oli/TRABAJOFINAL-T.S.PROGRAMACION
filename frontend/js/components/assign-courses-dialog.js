// Diálogo modal "Asignar cursos" (pantalla Asistentes del Administrador).
// Muestra todos los cursos activos con un checkbox (reutiliza .row-checkbox,
// el mismo componente visual que la selección múltiple de Alumnos). Al
// confirmar, compara contra los cursos que el asistente ya tenía asignados
// y sólo dispara un POST/DELETE por cada curso que efectivamente cambió de
// estado — no reenvía asignaciones que ya estaban.
import { cursoService } from '../services/cursoService.js';
import { asignarAsistenteService } from '../services/asignarAsistenteService.js';
import { ApiError } from '../services/httpClient.js';

export function initAssignCoursesDialog({ onSaved }) {
  const backdrop = document.getElementById('assign-courses-backdrop');
  if (!backdrop) return null;

  const nameEl = document.getElementById('assign-courses-name');
  const listEl = document.getElementById('assign-courses-list');
  const errorEl = document.getElementById('assign-courses-error');
  const cancelBtn = document.getElementById('assign-courses-cancel-btn');
  const confirmBtn = document.getElementById('assign-courses-confirm-btn');

  let asistenteActual = null;
  let idsAsignadosOriginal = new Set();
  let idsSeleccionados = new Set();
  let cursosCache = [];

  function renderList() {
    if (!cursosCache.length) {
      listEl.innerHTML = '<p class="list-row-empty">Todavía no hay cursos creados.</p>';
      return;
    }
    listEl.innerHTML = '';
    cursosCache.forEach((curso) => {
      const row = document.createElement('div');
      row.className = 'list-row';
      row.style.cursor = 'pointer';

      const left = document.createElement('div');
      left.style.display = 'flex';
      left.style.alignItems = 'center';
      left.style.gap = 'var(--space-2)';

      const checkbox = document.createElement('span');
      const marcado = idsSeleccionados.has(curso.id);
      checkbox.className = 'row-checkbox' + (marcado ? ' is-selected' : '');
      checkbox.innerHTML = '<span class="box">✓</span>';

      const title = document.createElement('div');
      title.className = 'list-row-title';
      title.textContent = curso.turno ? `${curso.nombre} · ${curso.turno}` : curso.nombre;

      left.appendChild(checkbox);
      left.appendChild(title);
      row.appendChild(left);

      row.addEventListener('click', () => {
        if (idsSeleccionados.has(curso.id)) idsSeleccionados.delete(curso.id);
        else idsSeleccionados.add(curso.id);
        renderList();
      });

      listEl.appendChild(row);
    });
  }

  async function open(asistente) {
    asistenteActual = asistente;
    errorEl.hidden = true;
    nameEl.textContent = `${asistente.nombre} ${asistente.apellido}`;
    idsAsignadosOriginal = new Set((asistente.cursosAsignados ?? []).map((c) => c.id));
    idsSeleccionados = new Set(idsAsignadosOriginal);

    listEl.innerHTML = '<p class="list-row-empty">Cargando cursos...</p>';
    backdrop.hidden = false;

    try {
      cursosCache = await cursoService.getAll();
      renderList();
    } catch (err) {
      listEl.innerHTML = '';
      errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudieron cargar los cursos.';
      errorEl.hidden = false;
    }
  }

  cancelBtn.addEventListener('click', () => {
    backdrop.hidden = true;
  });

  confirmBtn.addEventListener('click', async () => {
    if (!asistenteActual) return;

    const aAgregar = [...idsSeleccionados].filter((id) => !idsAsignadosOriginal.has(id));
    const aQuitar = [...idsAsignadosOriginal].filter((id) => !idsSeleccionados.has(id));

    if (!aAgregar.length && !aQuitar.length) {
      backdrop.hidden = true;
      return;
    }

    confirmBtn.disabled = true;
    errorEl.hidden = true;
    try {
      await Promise.all([
        ...aAgregar.map((idCurso) => asignarAsistenteService.asignar(asistenteActual.id, idCurso)),
        ...aQuitar.map((idCurso) => asignarAsistenteService.quitar(asistenteActual.id, idCurso)),
      ]);
      backdrop.hidden = true;
      await onSaved();
    } catch (err) {
      errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudieron guardar los cambios.';
      errorEl.hidden = false;
    } finally {
      confirmBtn.disabled = false;
    }
  });

  return { open };
}
