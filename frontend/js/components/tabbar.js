// Nav de pestañas (abajo en mobile/tablet, sidebar en desktop — ver
// components.css). Los tabs y a qué páginas agrupan son fieles al
// mockup: en Asistente, "Cursos" queda activo también al tomar
// asistencia o ver la confirmación; en Administrador, "Cursos" queda
// activo también en el detalle de curso y en alumnos/alumno.

// Rutas relativas a la carpeta del archivo actual (/asistente/*.html o
// /admin/*.html, ambas un nivel bajo de la raíz de /frontend) para que
// funcionen sin importar desde qué subpath se sirva la carpeta /frontend.
const TABS_ASISTENTE = [
  { label: 'Cursos', href: '../asistente/cursos.html', matches: ['asistente-cursos', 'asistente-asistencia', 'asistente-asistencia-guardada'] },
  { label: 'Perfil', href: '../asistente/perfil.html', matches: ['asistente-perfil'] },
];

const TABS_ADMIN = [
  { label: 'Inicio', href: '../admin/inicio.html', matches: ['admin-inicio'] },
  { label: 'Cursos', href: '../admin/cursos.html', matches: ['admin-cursos', 'admin-curso', 'admin-alumnos', 'admin-alumno'] },
  { label: 'Informes', href: '../admin/informes.html', matches: ['admin-informes'] },
  { label: 'Perfil', href: '../admin/perfil.html', matches: ['admin-perfil'] },
];

export function renderTabBar({ rolAdministrador, currentPage }) {
  const nav = document.getElementById('tab-bar');
  if (!nav) return;

  const tabs = rolAdministrador ? TABS_ADMIN : TABS_ASISTENTE;
  nav.innerHTML = '';
  for (const tab of tabs) {
    const a = document.createElement('a');
    a.className = 'tab-bar-item' + (tab.matches.includes(currentPage) ? ' is-active' : '');
    a.href = tab.href;
    a.textContent = tab.label;
    nav.appendChild(a);
  }
}
