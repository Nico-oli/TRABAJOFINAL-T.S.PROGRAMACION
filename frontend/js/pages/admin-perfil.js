import { bootApp } from '../app.js';

const session = bootApp({ currentPage: 'admin-perfil', requiredRole: 'ADMINISTRADOR', screenTitle: 'Perfil' });
if (session) init(session.usuario);

function init(usuario) {
  document.getElementById('profile-name').textContent = `${usuario.nombre} ${usuario.apellido}`;
}
