import { bootApp } from '../app.js';
import { cursoService } from '../services/cursoService.js';
import { alumnoService } from '../services/alumnoService.js';
import { renderAdminCourseCard } from '../components/course-card.js';
import { initCourseFormDialog } from '../components/course-form-dialog.js';
import { showToast } from '../components/toast.js';
import { ApiError } from '../services/httpClient.js';

const session = bootApp({ currentPage: 'admin-cursos', requiredRole: 'ADMINISTRADOR', screenTitle: 'Cursos' });
if (session) init();

async function init() {
  await loadCursos();

  initCourseFormDialog({
    onConfirm: async (dto) => {
      await cursoService.create(dto);
      showToast('Curso creado con éxito');
      await loadCursos();
    },
  });
}

async function loadCursos() {
  const list = document.getElementById('course-list');
  const errorEl = document.getElementById('course-list-error');
  errorEl.hidden = true;

  try {
    const cursos = await cursoService.getAll();
    if (!cursos.length) {
      list.innerHTML = '<p class="list-row-empty">Todavía no hay cursos creados.</p>';
      return;
    }
    const conteos = await Promise.all(cursos.map((c) => alumnoService.contarPorCurso(c.id)));

    list.innerHTML = '';
    cursos.forEach((curso, i) => {
      list.appendChild(renderAdminCourseCard({ ...curso, alumnosCount: conteos[i] }));
    });
  } catch (err) {
    errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudieron cargar los cursos.';
    errorEl.hidden = false;
  }
}
