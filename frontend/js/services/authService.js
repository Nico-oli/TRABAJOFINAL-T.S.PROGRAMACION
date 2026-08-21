import { http } from './httpClient.js';
import { setSession, clearSession } from '../session.js';

export const authService = {
  // POST /api/auth/login — { email, password } -> LoginResponse
  async login(email, password) {
    const data = await http.post('/auth/login', { email, password }, { auth: false });
    setSession({ token: data.token, usuario: data.usuario });
    return data.usuario;
  },

  // POST /api/auth/register — requiere rol ADMINISTRADOR autenticado.
  // Usado desde Admin > Asistentes para dar de alta cuentas de Asistente
  // (ver js/pages/admin-asistentes.js). El link "Crear cuenta" del login
  // sigue siendo un placeholder a propósito: el alta de cuentas es
  // exclusiva del Administrador, no un self-signup público.
  async register({ nombre, apellido, email, password, rol }) {
    return http.post('/auth/register', { nombre, apellido, email, password, rol });
  },

  logout() {
    clearSession();
  },
};
