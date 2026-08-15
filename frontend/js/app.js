// Shell compartido por todas las páginas de la app (no por el login):
// guard de sesión, completa el header y la tab-bar, y engancha logout.
// Cada página lo llama primero, antes de su propia lógica en /js/pages.
import { isAuthenticated, getUsuario, getRol } from './session.js';
import { authService } from './services/authService.js';
import { initHeader } from './components/header.js';
import { renderTabBar } from './components/tabbar.js';
import { PREVIEW_MODE } from './config.js';

/**
 * @param {string} currentPage clave de la página actual (coincide con las
 *   listas TABS_ASISTENTE/TABS_ADMIN de components/tabbar.js).
 * @param {'ADMINISTRADOR'|'ASISTENTE'} requiredRole rol dueño de esta pantalla.
 * @param {string} screenTitle título mostrado en el header.
 * @returns {{usuario, rol, rolAdministrador}|null} null si redirigió (no autenticado o rol incorrecto).
 */
export function bootApp({ currentPage, requiredRole, screenTitle }) {
  let usuario;
  let rol;

  if (PREVIEW_MODE) {
    // MODO VISTA PREVIA (ver js/config.js): no exige sesión real. Prioriza
    // el rol que la propia página requiere (no el de una sesión mock que
    // haya quedado guardada) para que cada una de las 12 pantallas se
    // pueda abrir directo por URL y se vea siempre correcta, sin importar
    // con qué rol se haya "logueado" antes. Recordar volver PREVIEW_MODE
    // a false antes de conectar con el backend real / antes de la entrega.
    rol = requiredRole ?? getRol() ?? 'ASISTENTE';
    usuario = { id: 0, nombre: 'Vista', apellido: 'Previa', email: 'preview@local', rol };
  } else {
    if (!isAuthenticated()) {
      window.location.href = '../index.html';
      return null;
    }

    usuario = getUsuario();
    rol = getRol();

    if (requiredRole && rol !== requiredRole) {
      // Logueado pero con el otro rol: lo mandamos a su propia home en vez
      // de dejarlo en una pantalla para la que no tiene permiso.
      window.location.href = rol === 'ADMINISTRADOR' ? '../admin/inicio.html' : '../asistente/cursos.html';
      return null;
    }
  }

  const rolAdministrador = rol === 'ADMINISTRADOR';

  initHeader({
    screenTitle,
    roleLabel: rolAdministrador ? 'Administrador' : 'Asistente',
    rolAdministrador,
  });
  renderTabBar({ rolAdministrador, currentPage });

  const logoutBtn = document.getElementById('logout-btn');
  logoutBtn?.addEventListener('click', () => {
    authService.logout();
    window.location.href = '../index.html';
  });

  // TODO: "Cambiar a Administrador/Asistente (demo)" no tiene equivalente
  // real — el rol lo asigna el backend al loguearse (va en el JWT), no
  // se puede cambiar desde el cliente. Se conserva el botón para ser
  // fiel al mockup, pero su acción es cerrar sesión para volver a
  // loguearse con una cuenta del otro rol.
  const switchRoleBtn = document.getElementById('switch-role-btn');
  switchRoleBtn?.addEventListener('click', () => {
    authService.logout();
    window.location.href = '../index.html';
  });

  return { usuario, rol, rolAdministrador };
}
