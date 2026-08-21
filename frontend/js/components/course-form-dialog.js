// Diálogo modal "Nuevo curso" (pantalla Cursos del Administrador). Sólo
// maneja mostrar/ocultar, leer campos y una validación mínima de client;
// el POST real lo hace la página vía el callback onConfirm (capa de
// servicios, no acá) — mismo patrón que components/justify-dialog.js.
import { ApiError } from '../services/httpClient.js';

export function initCourseFormDialog({ onConfirm }) {
  const backdrop = document.getElementById('course-form-backdrop');
  if (!backdrop) return;

  const errorEl = document.getElementById('course-form-error');
  const nombreInput = document.getElementById('course-form-nombre');
  const anioInput = document.getElementById('course-form-anio');
  const turnoInput = document.getElementById('course-form-turno');
  const openBtn = document.getElementById('new-course-open-btn');
  const cancelBtn = document.getElementById('course-form-cancel-btn');
  const confirmBtn = document.getElementById('course-form-confirm-btn');

  function resetForm() {
    nombreInput.value = '';
    anioInput.value = '';
    turnoInput.value = '';
    errorEl.hidden = true;
  }

  openBtn.addEventListener('click', () => {
    resetForm();
    backdrop.hidden = false;
    nombreInput.focus();
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

    confirmBtn.disabled = true;
    errorEl.hidden = true;
    try {
      await onConfirm({ nombre, anioLectivo, turno: turno || null });
      backdrop.hidden = true;
    } catch (err) {
      errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudo crear el curso.';
      errorEl.hidden = false;
    } finally {
      confirmBtn.disabled = false;
    }
  });
}
