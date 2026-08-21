// Diálogo modal "Editar alumno" (pantalla Alumno del Administrador).
// Precarga nombre/apellido/curso/faltas del alumno ya cargado en la página
// (getAlumno()), deja editar cualquier subconjunto de esos campos, y sólo
// informa a onConfirm los que realmente cambiaron — la página decide cómo
// mandarlos (ver admin-alumno.js, que usa alumnoService.actualizarSeguro
// para armar igual un PATCH completo y esquivar el bug de PATCH parcial).
import { ApiError } from '../services/httpClient.js';
import { cursoService } from '../services/cursoService.js';

export function initEditStudentDialog({ getAlumno, onConfirm }) {
  const backdrop = document.getElementById('edit-student-backdrop');
  const openBtn = document.getElementById('edit-student-open-btn');
  if (!backdrop || !openBtn) return;

  const errorEl = document.getElementById('edit-student-error');
  const nombreInput = document.getElementById('edit-student-nombre');
  const apellidoInput = document.getElementById('edit-student-apellido');
  const cursoSelect = document.getElementById('edit-student-curso');
  const faltasInput = document.getElementById('edit-student-faltas');
  const cancelBtn = document.getElementById('edit-student-cancel-btn');
  const confirmBtn = document.getElementById('edit-student-confirm-btn');

  async function populateForm() {
    const alumno = getAlumno();
    errorEl.hidden = true;
    nombreInput.value = alumno.nombre;
    apellidoInput.value = alumno.apellido;
    faltasInput.value = alumno.inAsistencias;

    cursoSelect.disabled = true;
    cursoSelect.innerHTML = '<option value="">Cargando cursos...</option>';
    try {
      const cursos = await cursoService.getAll();
      cursoSelect.innerHTML = cursos
        .map((c) => `<option value="${c.id}">${c.nombre}${c.turno ? ' · ' + c.turno : ''}</option>`)
        .join('');
      cursoSelect.value = String(alumno.curso.id);
    } catch {
      cursoSelect.innerHTML = '<option value="">No se pudieron cargar los cursos</option>';
    } finally {
      cursoSelect.disabled = false;
    }
  }

  openBtn.addEventListener('click', async () => {
    backdrop.hidden = false;
    await populateForm();
    nombreInput.focus();
  });

  cancelBtn.addEventListener('click', () => {
    backdrop.hidden = true;
  });

  confirmBtn.addEventListener('click', async () => {
    const alumno = getAlumno();
    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    const idCurso = Number(cursoSelect.value);
    const faltas = Number(faltasInput.value);

    if (!nombre || !apellido || !idCurso || faltasInput.value === '') {
      errorEl.textContent = 'Completá todos los campos.';
      errorEl.hidden = false;
      return;
    }

    // Sólo se informan los campos que realmente cambiaron respecto al
    // alumno cargado — la página arma el PATCH completo a partir de esto.
    const cambios = {};
    if (nombre !== alumno.nombre) cambios.nombre = nombre;
    if (apellido !== alumno.apellido) cambios.apellido = apellido;
    if (idCurso !== alumno.curso.id) cambios.idCurso = idCurso;
    if (faltas !== alumno.inAsistencias) cambios.faltas = faltas;

    if (!Object.keys(cambios).length) {
      backdrop.hidden = true;
      return;
    }

    confirmBtn.disabled = true;
    errorEl.hidden = true;
    try {
      await onConfirm(cambios);
      backdrop.hidden = true;
    } catch (err) {
      errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudo editar el alumno.';
      errorEl.hidden = false;
    } finally {
      confirmBtn.disabled = false;
    }
  });
}
