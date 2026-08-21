// Diálogo modal "Nuevo alumno" — reutilizado desde admin/alumnos.html
// (listado global, curso a elegir) y admin/curso.html (detalle de curso,
// curso preseleccionado). Mismo patrón que justify-dialog.js /
// course-form-dialog.js: sólo maneja mostrar/ocultar, leer campos y una
// validación mínima de cliente; el POST real lo hace la página vía el
// callback onConfirm.
import { ApiError } from '../services/httpClient.js';
import { cursoService } from '../services/cursoService.js';

export function initStudentFormDialog({ openBtnId, defaultCursoId = null, onConfirm }) {
  const backdrop = document.getElementById('student-form-backdrop');
  const openBtn = document.getElementById(openBtnId);
  if (!backdrop || !openBtn) return;

  const errorEl = document.getElementById('student-form-error');
  const nombreInput = document.getElementById('student-form-nombre');
  const apellidoInput = document.getElementById('student-form-apellido');
  const dniInput = document.getElementById('student-form-dni');
  const nacimientoInput = document.getElementById('student-form-nacimiento');
  const cursoSelect = document.getElementById('student-form-curso');
  const cancelBtn = document.getElementById('student-form-cancel-btn');
  const confirmBtn = document.getElementById('student-form-confirm-btn');

  function resetForm() {
    nombreInput.value = '';
    apellidoInput.value = '';
    dniInput.value = '';
    nacimientoInput.value = '';
    errorEl.hidden = true;
  }

  async function populateCursos() {
    cursoSelect.disabled = true;
    cursoSelect.innerHTML = '<option value="">Cargando cursos...</option>';
    try {
      const cursos = await cursoService.getAll();
      if (!cursos.length) {
        cursoSelect.innerHTML = '<option value="">No hay cursos creados</option>';
        return;
      }
      cursoSelect.innerHTML = cursos
        .map((c) => `<option value="${c.id}">${c.nombre}${c.turno ? ' · ' + c.turno : ''}</option>`)
        .join('');
      if (defaultCursoId != null) cursoSelect.value = String(defaultCursoId);
    } catch {
      cursoSelect.innerHTML = '<option value="">No se pudieron cargar los cursos</option>';
    } finally {
      cursoSelect.disabled = false;
    }
  }

  openBtn.addEventListener('click', async () => {
    resetForm();
    backdrop.hidden = false;
    await populateCursos();
    nombreInput.focus();
  });

  cancelBtn.addEventListener('click', () => {
    backdrop.hidden = true;
  });

  confirmBtn.addEventListener('click', async () => {
    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    const dni = Number(dniInput.value);
    const fechaDeNacimiento = nacimientoInput.value;
    const idCurso = Number(cursoSelect.value);

    if (!nombre || !apellido || !dniInput.value || !fechaDeNacimiento || !idCurso) {
      errorEl.textContent = 'Completá todos los campos.';
      errorEl.hidden = false;
      return;
    }

    confirmBtn.disabled = true;
    errorEl.hidden = true;
    try {
      await onConfirm({ dni, nombre, apellido, fechaDeNacimiento, idCurso });
      backdrop.hidden = true;
    } catch (err) {
      errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudo crear el alumno.';
      errorEl.hidden = false;
    } finally {
      confirmBtn.disabled = false;
    }
  });
}
