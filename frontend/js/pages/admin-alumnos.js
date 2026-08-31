import { bootApp } from '../app.js';
import { cursoService } from '../services/cursoService.js';
import { alumnoService } from '../services/alumnoService.js';
import { renderStudentRow } from '../components/student-row.js';
import { initStudentFormDialog } from '../components/student-form-dialog.js';
import { initMoveCourseBar } from '../components/move-course-dialog.js';
import { showToast } from '../components/toast.js';
import { ApiError } from '../services/httpClient.js';

let allStudents = [];
let selectMode = false;
const selectedIds = new Set();

let searchInput;
let selectModeBtn;
let moveBar;

function init() {
  searchInput = document.getElementById('student-search');
  selectModeBtn = document.getElementById('select-mode-toggle-btn');

  moveBar = initMoveCourseBar({
    getSelectedIds: () => [...selectedIds],
    getStudentLabel: (id) => {
      const a = allStudents.find((s) => s.id === id);
      return a ? `${a.nombre} ${a.apellido}` : `#${id}`;
    },
    onExitSelection: exitSelectMode,
    onMoved: async ({ exitosos }) => {
      exitosos.forEach((id) => selectedIds.delete(id));
      exitSelectMode();
      await loadStudents();
    },
  });

  loadStudents();

  searchInput.addEventListener('input', () => {
    render(currentFiltered());
  });

  selectModeBtn.addEventListener('click', async () => {
    if (selectMode) {
      exitSelectMode();
      return;
    }
    selectMode = true;
    selectedIds.clear();
    selectModeBtn.textContent = 'Cancelar';
    if (moveBar) await moveBar.populateCursos();
    render(currentFiltered());
    moveBar?.refresh();
  });

  initStudentFormDialog({
    openBtnId: 'new-student-open-btn',
    onConfirm: async (dto) => {
      await alumnoService.create(dto);
      showToast('Alumno creado con éxito');
      searchInput.value = '';
      await loadStudents();
    },
  });
}

function exitSelectMode() {
  selectMode = false;
  selectedIds.clear();
  selectModeBtn.textContent = 'Seleccionar';
  render(currentFiltered());
  moveBar?.refresh();
}

function currentFiltered() {
  const q = searchInput.value.trim().toLowerCase();
  return q
    ? allStudents.filter((a) => `${a.nombre} ${a.apellido}`.toLowerCase().includes(q))
    : allStudents;
}

async function loadStudents() {
  const errorEl = document.getElementById('student-list-error');
  errorEl.hidden = true;

  try {
    const cursos = await cursoService.getAll();
    const rosters = await Promise.all(cursos.map((c) => alumnoService.getPorCurso(c.id)));
    allStudents = rosters.flatMap((roster, i) => roster.map((a) => ({ ...a, courseName: cursos[i].nombre })));
    render(currentFiltered());
  } catch (err) {
    errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudieron cargar los alumnos.';
    errorEl.hidden = false;
  }
}

function render(students) {
  const listEl = document.getElementById('student-list');
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
        limiteFaltasEfectivo: a.limiteFaltasEfectivo,
        avisoFaltasEfectivo: a.avisoFaltasEfectivo,
        href: `./alumno.html?id=${a.id}`,
        selectable: selectMode,
        selected: selectedIds.has(a.id),
        onToggleSelect: () => {
          if (selectedIds.has(a.id)) selectedIds.delete(a.id);
          else selectedIds.add(a.id);
          render(currentFiltered());
          moveBar?.refresh();
        },
      }),
    );
  });
}

const session = bootApp({ currentPage: 'admin-alumnos', requiredRole: 'ADMINISTRADOR', screenTitle: 'Alumnos' });
if (session) init();
