import { bootApp } from '../app.js';
import { cursoService } from '../services/cursoService.js';
import { alumnoService } from '../services/alumnoService.js';
import { renderStudentRow } from '../components/student-row.js';
import { initStudentFormDialog } from '../components/student-form-dialog.js';
import { showToast } from '../components/toast.js';
import { ApiError } from '../services/httpClient.js';

const session = bootApp({ currentPage: 'admin-curso', requiredRole: 'ADMINISTRADOR', screenTitle: 'Curso' });
const idCurso = new URLSearchParams(window.location.search).get('id');

if (session && idCurso) init();
else if (session) window.location.href = './cursos.html';

document.getElementById('back-to-courses-btn').addEventListener('click', () => {
  window.location.href = './cursos.html';
});

async function init() {
  await loadCurso();

  initStudentFormDialog({
    openBtnId: 'new-student-open-btn',
    defaultCursoId: idCurso,
    onConfirm: async (dto) => {
      await alumnoService.create(dto);
      showToast('Alumno creado con éxito');
      await loadCurso();
    },
  });
}

async function loadCurso() {
  const cardEl = document.getElementById('course-card');
  const rosterEl = document.getElementById('course-roster');
  const errorEl = document.getElementById('course-error');
  errorEl.hidden = true;

  try {
    const [cursos, roster] = await Promise.all([
      cursoService.getAll(),
      alumnoService.getPorCurso(idCurso),
    ]);
    const curso = cursos.find((c) => String(c.id) === String(idCurso));
    const asistenteLabel = curso?.asistentes?.length ? curso.asistentes.join(', ') : 'sin asignar';

    cardEl.innerHTML = `
      <div class="card-title">${curso ? curso.nombre : 'Curso'}</div>
      <div class="card-body">${curso ? curso.turno : ''} · Asistente: ${asistenteLabel}</div>
    `;

    rosterEl.innerHTML = '';
    if (!roster.length) {
      rosterEl.innerHTML = '<p class="list-row-empty">Este curso todavía no tiene alumnos.</p>';
      return;
    }
    roster.forEach((a) => {
      rosterEl.appendChild(
        renderStudentRow({
          nombre: a.nombre,
          apellido: a.apellido,
          inAsistencias: a.inAsistencias,
          href: `./alumno.html?id=${a.id}`,
        }),
      );
    });
  } catch (err) {
    errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudo cargar el curso.';
    errorEl.hidden = false;
  }
}
