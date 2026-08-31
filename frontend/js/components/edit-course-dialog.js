// Diálogo modal "Editar curso" (pantalla Curso del Administrador).
//
// Nombre/año lectivo/turno van por PATCH /api/admin/curso/{id}
// (cursoService.actualizar — real). La asignación de preceptores NO forma
// parte de CursoActualizarRequest: el backend la maneja aparte, vía
// POST/DELETE /api/admin/usuario/{idUsuario}/curso/{idCurso}
// (asignarAsistenteService), los mismos endpoints reales que ya usa
// Asistentes > "Asignar cursos" — acá se recorren al revés: se listan todos
// los asistentes y se resuelve cuáles tienen este curso en su
// cursosAsignados, para precargar el checklist y sólo mandar un
// asignar()/quitar() por cada uno que efectivamente cambió.
import { cursoService } from '../services/cursoService.js';
import { asignarAsistenteService } from '../services/asignarAsistenteService.js';
import { ApiError } from '../services/httpClient.js';

export function initEditCourseDialog({ getCurso, getIdCurso, onSaved }) {
  const backdrop = document.getElementById('edit-course-backdrop');
  const openBtn = document.getElementById('edit-course-open-btn');
  if (!backdrop || !openBtn) return;

  const errorEl = document.getElementById('edit-course-error');
  const nombreInput = document.getElementById('edit-course-nombre');
  const anioInput = document.getElementById('edit-course-anio');
  const turnoInput = document.getElementById('edit-course-turno');
  const asistentesListEl = document.getElementById('edit-course-asistentes');
  const cancelBtn = document.getElementById('edit-course-cancel-btn');
  const confirmBtn = document.getElementById('edit-course-confirm-btn');

  let asistentesCache = [];
  let idsAsignadosOriginal = new Set();
  let idsSeleccionados = new Set();

  function renderAsistentesList() {
    if (!asistentesCache.length) {
      asistentesListEl.innerHTML = '<p class="list-row-empty">Todavía no hay asistentes creados.</p>';
      return;
    }
    asistentesListEl.innerHTML = '';
    asistentesCache.forEach((asistente) => {
      const row = document.createElement('div');
      row.className = 'list-row';
      row.style.cursor = 'pointer';

      const left = document.createElement('div');
      left.style.display = 'flex';
      left.style.alignItems = 'center';
      left.style.gap = 'var(--space-2)';

      const checkbox = document.createElement('span');
      const marcado = idsSeleccionados.has(asistente.id);
      checkbox.className = 'row-checkbox' + (marcado ? ' is-selected' : '');
      checkbox.innerHTML = '<span class="box">✓</span>';

      const title = document.createElement('div');
      title.className = 'list-row-title';
      title.textContent = `${asistente.nombre} ${asistente.apellido}`;

      left.appendChild(checkbox);
      left.appendChild(title);
      row.appendChild(left);

      row.addEventListener('click', () => {
        if (idsSeleccionados.has(asistente.id)) idsSeleccionados.delete(asistente.id);
        else idsSeleccionados.add(asistente.id);
        renderAsistentesList();
      });

      asistentesListEl.appendChild(row);
    });
  }

  openBtn.addEventListener('click', async () => {
    const curso = getCurso();
    errorEl.hidden = true;
    nombreInput.value = curso?.nombre ?? '';
    anioInput.value = curso?.anioLectivo ?? '';
    turnoInput.value = curso?.turno ?? '';

    asistentesListEl.innerHTML = '<p class="list-row-empty">Cargando asistentes...</p>';
    backdrop.hidden = false;

    try {
      asistentesCache = await asignarAsistenteService.listar();
      const idCurso = Number(getIdCurso());
      idsAsignadosOriginal = new Set(
        asistentesCache
          .filter((a) => (a.cursosAsignados ?? []).some((c) => c.id === idCurso))
          .map((a) => a.id),
      );
      idsSeleccionados = new Set(idsAsignadosOriginal);
      renderAsistentesList();
    } catch (err) {
      asistentesListEl.innerHTML = '';
      errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudieron cargar los asistentes.';
      errorEl.hidden = false;
    }
  });

  cancelBtn.addEventListener('click', () => {
    backdrop.hidden = true;
  });

  confirmBtn.addEventListener('click', async () => {
    const nombre = nombreInput.value.trim();
    const anioLectivo = Number(anioInput.value);
    const turno = turnoInput.value.trim();

    if (!nombre || !anioInput.value) {
      errorEl.textContent = 'Completá nombre y año lectivo.';
      errorEl.hidden = false;
      return;
    }

    const idCurso = Number(getIdCurso());
    const aAgregar = [...idsSeleccionados].filter((id) => !idsAsignadosOriginal.has(id));
    const aQuitar = [...idsAsignadosOriginal].filter((id) => !idsSeleccionados.has(id));

    confirmBtn.disabled = true;
    errorEl.hidden = true;
    try {
      await cursoService.actualizar(idCurso, { nombre, anioLectivo, turno: turno || null });
      await Promise.all([
        ...aAgregar.map((idAsistente) => asignarAsistenteService.asignar(idAsistente, idCurso)),
        ...aQuitar.map((idAsistente) => asignarAsistenteService.quitar(idAsistente, idCurso)),
      ]);
      backdrop.hidden = true;
      await onSaved();
    } catch (err) {
      errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudo actualizar el curso.';
      errorEl.hidden = false;
    } finally {
      confirmBtn.disabled = false;
    }
  });
}
