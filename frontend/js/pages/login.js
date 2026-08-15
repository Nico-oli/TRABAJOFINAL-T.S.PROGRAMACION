import { isAuthenticated, getRol } from '../session.js';
import { authService } from '../services/authService.js';
import { ApiError } from '../services/httpClient.js';

// Si ya hay sesión activa, no tiene sentido mostrar el login de nuevo.
if (isAuthenticated()) {
  redirectByRol(getRol());
}

function redirectByRol(rol) {
  window.location.href = rol === 'ADMINISTRADOR' ? './admin/inicio.html' : './asistente/cursos.html';
}

const form = document.getElementById('login-form');
const errorEl = document.getElementById('login-error');
const submitBtn = document.getElementById('login-submit');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.hidden = true;
  submitBtn.disabled = true;

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  try {
    const usuario = await authService.login(email, password);
    redirectByRol(usuario.rol);
  } catch (err) {
    errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudo iniciar sesión.';
    errorEl.hidden = false;
    submitBtn.disabled = false;
  }
});
