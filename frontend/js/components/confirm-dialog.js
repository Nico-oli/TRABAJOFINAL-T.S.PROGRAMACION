// Diálogo de confirmación genérico y reutilizable, para toda acción de baja
// lógica (alumno, curso, asistente) que requiera "¿estás seguro?" antes de
// ejecutarse. Cada página instancia el suyo apuntando a su propio set de ids
// (backdrop/título/mensaje/error/botones) y le pasa el callback real
// (alumnoService.eliminar, cursoService.darDeBaja, etc.) al llamar open().
import { ApiError } from '../services/httpClient.js';

export function initConfirmDialog({ backdropId, titleId, messageId, errorId, cancelBtnId, confirmBtnId }) {
  const backdrop = document.getElementById(backdropId);
  if (!backdrop) return null;

  const titleEl = document.getElementById(titleId);
  const messageEl = document.getElementById(messageId);
  const errorEl = document.getElementById(errorId);
  const cancelBtn = document.getElementById(cancelBtnId);
  const confirmBtn = document.getElementById(confirmBtnId);

  let onConfirmCb = null;

  cancelBtn.addEventListener('click', () => {
    backdrop.hidden = true;
  });

  confirmBtn.addEventListener('click', async () => {
    if (!onConfirmCb) return;
    confirmBtn.disabled = true;
    errorEl.hidden = true;
    try {
      await onConfirmCb();
      backdrop.hidden = true;
    } catch (err) {
      errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudo completar la acción.';
      errorEl.hidden = false;
    } finally {
      confirmBtn.disabled = false;
    }
  });

  function open({ title, message, onConfirm }) {
    titleEl.textContent = title;
    messageEl.textContent = message;
    errorEl.hidden = true;
    onConfirmCb = onConfirm;
    backdrop.hidden = false;
  }

  return { open };
}
