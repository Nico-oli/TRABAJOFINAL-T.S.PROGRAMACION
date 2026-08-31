// Diálogo modal "Reincorporar" (pantalla Alumno del Administrador).
//
// La reincorporación por faltas adicionales es un pago fijo: se acredita
// una cantidad predefinida (5, 10 o 15) que se suma de forma acumulable al
// cupo adicional del alumno — no un valor libre — por eso son 3 botones en
// vez de un input numérico. Pega contra el endpoint real:
// POST /api/admin/alumno/{id}/reincorporar { cantidadFaltasAdicionales }
// (ver alumnoService.reincorporar). El backend rechaza cualquier otro valor.
import { ApiError } from '../services/httpClient.js';

const CANTIDADES = [5, 10, 15];

export function initReincorporateDialog({ onConfirm }) {
  const backdrop = document.getElementById('reincorporate-backdrop');
  const openBtn = document.getElementById('reincorporate-open-btn');
  if (!backdrop || !openBtn) return null;

  const errorEl = document.getElementById('reincorporate-error');
  const cancelBtn = document.getElementById('reincorporate-cancel-btn');
  const confirmBtn = document.getElementById('reincorporate-confirm-btn');
  const cantidadBtns = CANTIDADES.map((c) => document.getElementById(`reincorporate-cantidad-${c}`)).filter(Boolean);

  let cantidadSeleccionada = null;

  function marcarSeleccion() {
    cantidadBtns.forEach((btn) => {
      const activo = Number(btn.dataset.cantidad) === cantidadSeleccionada;
      btn.classList.toggle('btn-primary', activo);
      btn.classList.toggle('btn-secondary', !activo);
    });
    confirmBtn.disabled = cantidadSeleccionada === null;
  }

  cantidadBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      cantidadSeleccionada = Number(btn.dataset.cantidad);
      marcarSeleccion();
    });
  });

  openBtn.addEventListener('click', () => {
    errorEl.hidden = true;
    cantidadSeleccionada = null;
    marcarSeleccion();
    backdrop.hidden = false;
  });

  cancelBtn.addEventListener('click', () => {
    backdrop.hidden = true;
  });

  confirmBtn.addEventListener('click', async () => {
    if (cantidadSeleccionada === null) return;

    confirmBtn.disabled = true;
    errorEl.hidden = true;
    try {
      await onConfirm(cantidadSeleccionada);
      backdrop.hidden = true;
    } catch (err) {
      errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudo reincorporar al alumno.';
      errorEl.hidden = false;
      confirmBtn.disabled = false;
    }
  });

  return {
    setVisible(visible) {
      openBtn.hidden = !visible;
    },
  };
}
