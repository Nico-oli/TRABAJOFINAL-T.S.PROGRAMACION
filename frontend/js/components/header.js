// Encabezado de la app (kicker "Asistencia" + título de pantalla + tag de
// rol). El markup fijo vive en cada .html; esta función sólo completa las
// partes dinámicas y hace foco en mantener la UI separada del fetch.
export function initHeader({ screenTitle, roleLabel, rolAdministrador }) {
  const titleEl = document.getElementById('app-header-title');
  const roleEl = document.getElementById('app-header-role');
  if (titleEl) titleEl.textContent = screenTitle;
  if (roleEl) {
    roleEl.textContent = roleLabel;
    roleEl.className = rolAdministrador ? 'tag tag-accent' : 'tag tag-outline';
  }
}
