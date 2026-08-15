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
  // TODO: el mockup no incluye ninguna pantalla de registro (el link
  // "Crear cuenta" del login es un placeholder sin acción, ver
  // js/pages/login.js). Este método queda listo para cuando se agregue
  // esa pantalla al diseño.
  async register({ nombre, apellido, email, password, rol }) {
    return http.post('/auth/register', { nombre, apellido, email, password, rol });
  },

  logout() {
    clearSession();
  },
};
