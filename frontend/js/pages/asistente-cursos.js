import { bootApp } from '../app.js';
import { cursoService } from '../services/cursoService.js';
import { alumnoService } from '../services/alumnoService.js';
import { renderAsistenteCourseCard } from '../components/course-card.js';
import { ApiError } from '../services/httpClient.js';

const session = bootApp({ currentPage: 'asistente-cursos', requiredRole: 'ASISTENTE', screenTitle: 'Mis cursos' });
if (session) init();

async function init() {
  const list = document.getElementById('course-list');
  const errorEl = document.getElementById('course-list-error');

  try {
    // GET /api/curso ya viene filtrado server-side a los cursos
    // asignados a este asistente.
    const cursos = await cursoService.getAll();

    if (!cursos.length) {
      list.innerHTML = '<p class="list-row-empty">Todavía no tenés cursos asignados.</p>';
      return;
    }

    const conteos = await Promise.all(cursos.map((c) => alumnoService.contarPorCurso(c.id)));

    list.innerHTML = '';
    cursos.forEach((curso, i) => {
      list.appendChild(renderAsistenteCourseCard({ ...curso, alumnosCount: conteos[i] }));
    });
  } catch (err) {
    errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudieron cargar los cursos.';
    errorEl.hidden = false;
  }
}
