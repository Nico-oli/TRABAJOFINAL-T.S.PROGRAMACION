import { bootApp } from '../app.js';
import { cursoService } from '../services/cursoService.js';
import { alumnoService } from '../services/alumnoService.js';
import { renderStudentRow } from '../components/student-row.js';
import { ApiError } from '../services/httpClient.js';

const session = bootApp({ currentPage: 'admin-alumnos', requiredRole: 'ADMINISTRADOR', screenTitle: 'Alumnos' });
if (session) init();

let allStudents = [];

async function init() {
  const searchInput = document.getElementById('student-search');
  const listEl = document.getElementById('student-list');
  const errorEl = document.getElementById('student-list-error');

  try {
    const cursos = await cursoService.getAll();
    const rosters = await Promise.all(cursos.map((c) => alumnoService.getPorCurso(c.id)));
    allStudents = rosters.flatMap((roster, i) => roster.map((a) => ({ ...a, courseName: cursos[i].nombre })));
    render(allStudents);
  } catch (err) {
    errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudieron cargar los alumnos.';
    errorEl.hidden = false;
    return;
  }

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    const filtered = q
      ? allStudents.filter((a) => `${a.nombre} ${a.apellido}`.toLowerCase().includes(q))
      : allStudents;
    render(filtered);
  });

  function render(students) {
    listEl.innerHTML = '';
    if (!students.length) {
      listEl.innerHTML = '<p class="list-row-empty">No se encontraron alumnos.</p>';
      return;
    }
    students.forEach((a) => {
      listEl.appendChild(
        renderStudentRow({
          nombre: a.nombre,
          apellido: a.apellido,
          courseName: a.courseName,
          inAsistencias: a.inAsistencias,
          href: `./alumno.html?id=${a.id}`,
        }),
      );
    });
  }
}
