// Diálogo modal "Nuevo asistente" (pantalla Asistentes del Administrador).
// Sólo maneja mostrar/ocultar, leer campos y una validación mínima de
// cliente; el alta real la hace la página vía el callback onConfirm
// (capa de servicios, no acá) — mismo patrón que course-form-dialog.js.
import { ApiError } from '../services/httpClient.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initAssistantFormDialog({ onConfirm }) {
  const backdrop = document.getElementById('assistant-form-backdrop');
  if (!backdrop) return;

  const errorEl = document.getElementById('assistant-form-error');
  const nombreInput = document.getElementById('assistant-form-nombre');
  const apellidoInput = document.getElementById('assistant-form-apellido');
  const emailInput = document.getElementById('assistant-form-email');
  const passwordInput = document.getElementById('assistant-form-password');
  const openBtn = document.getElementById('new-assistant-open-btn');
  const cancelBtn = document.getElementById('assistant-form-cancel-btn');
  const confirmBtn = document.getElementById('assistant-form-confirm-btn');

  function resetForm() {
    nombreInput.value = '';
    apellidoInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
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
    const apellido = apellidoInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!nombre || !apellido || !email || !password) {
      errorEl.textContent = 'Completá todos los campos.';
      errorEl.hidden = false;
      return;
    }
    if (!EMAIL_RE.test(email)) {
      errorEl.textContent = 'El email no tiene un formato válido.';
      errorEl.hidden = false;
      return;
    }
    if (password.length < 8) {
      errorEl.textContent = 'La contraseña debe tener al menos 8 caracteres.';
      errorEl.hidden = false;
      return;
    }

    confirmBtn.disabled = true;
    errorEl.hidden = true;
    try {
      await onConfirm({ nombre, apellido, email, password, rol: 'ASISTENTE' });
      backdrop.hidden = true;
    } catch (err) {
      errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudo crear el asistente.';
      errorEl.hidden = false;
    } finally {
      confirmBtn.disabled = false;
    }
  });
}
