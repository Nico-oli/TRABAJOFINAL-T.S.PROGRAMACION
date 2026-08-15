import { bootApp } from '../app.js';
import { cursoService } from '../services/cursoService.js';
import { ApiError } from '../services/httpClient.js';

const session = bootApp({ currentPage: 'asistente-perfil', requiredRole: 'ASISTENTE', screenTitle: 'Perfil' });
if (session) init(session.usuario);

async function init(usuario) {
  document.getElementById('profile-name').textContent = `Prof. ${usuario.apellido}`;

  const listEl = document.getElementById('profile-courses');
  try {
    const cursos = await cursoService.getAll();
    listEl.innerHTML = cursos.length
      ? cursos.map((c) => `<div class="list-row"><span class="list-row-title">${c.nombre} · ${c.turno ?? ''}</span></div>`).join('')
      : '<p class="list-row-empty">Sin cursos asignados.</p>';
  } catch (err) {
    listEl.innerHTML = `<p class="list-row-empty">${err instanceof ApiError ? err.message : 'No se pudieron cargar los cursos.'}</p>`;
  }
}
