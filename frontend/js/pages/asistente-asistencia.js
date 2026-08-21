import { bootApp } from '../app.js';
import { cursoService } from '../services/cursoService.js';
import { alumnoService } from '../services/alumnoService.js';
import { asistenciaService } from '../services/asistenciaService.js';
import { renderAttendanceRow } from '../components/attendance-row.js';
import { ApiError } from '../services/httpClient.js';

const session = bootApp({ currentPage: 'asistente-asistencia', requiredRole: 'ASISTENTE', screenTitle: 'Tomar asistencia' });
const idCurso = new URLSearchParams(window.location.search).get('curso');

if (session && idCurso) init();
else if (session) window.location.href = './cursos.html';

// draft: Map<idAlumno, 'PRESENTE' | 'AUSENTE'>
const draft = new Map();
let roster = [];

async function init() {
  const subtitleEl = document.getElementById('attendance-subtitle');
  const listEl = document.getElementById('attendance-list');
  const absentCountEl = document.getElementById('attendance-absent-count');
  const errorEl = document.getElementById('attendance-error');
  const submitBtn = document.getElementById('attendance-submit');
  const cancelBtn = document.getElementById('attendance-cancel');

  cancelBtn.addEventListener('click', () => { window.location.href = './cursos.html'; });

  try {
    const [cursos, alumnos] = await Promise.all([
      cursoService.getAll(),
      alumnoService.getPorCurso(idCurso),
    ]);
    const curso = cursos.find((c) => String(c.id) === String(idCurso));
    roster = alumnos;

    const fechaLarga = new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date());
    subtitleEl.textContent = `${curso ? curso.nombre : 'Curso'} · ${fechaLarga}`;

    roster.forEach((a) => draft.set(a.id, 'PRESENTE'));
    renderList();
  } catch (err) {
    errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudo cargar el curso.';
    errorEl.hidden = false;
    return;
  }

  submitBtn.addEventListener('click', async () => {
    submitBtn.disabled = true;
    errorEl.hidden = true;
    try {
      const registros = roster.map((a) => ({
        idAlumno: a.id,
        idCurso: Number(idCurso),
        estadoAsistencia: draft.get(a.id),
        observacion: null,
      }));
      await asistenciaService.guardar(registros);
      window.location.href = `./asistencia-guardada.html?curso=${idCurso}`;
    } catch (err) {
      // TODO: como el rol Asistente no puede consultar si ya se tomó
      // asistencia hoy para este curso (ver asistenciaService.getPorFecha),
      // reenviar esta pantalla el mismo día pisa un registro existente y
      // el backend responde error por la restricción única (alumno,fecha).
      errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudo guardar la asistencia.';
      errorEl.hidden = false;
      submitBtn.disabled = false;
    }
  });

  function renderList() {
    listEl.innerHTML = '';
    roster.forEach((alumno) => {
      const absent = draft.get(alumno.id) === 'AUSENTE';
      listEl.appendChild(
        renderAttendanceRow({ nombre: `${alumno.nombre} ${alumno.apellido}`, absent }, () => {
          draft.set(alumno.id, absent ? 'PRESENTE' : 'AUSENTE');
          renderList();
        }),
      );
    });
    const absentCount = [...draft.values()].filter((v) => v === 'AUSENTE').length;
    absentCountEl.textContent = `${absentCount}  ausentes`;
  }
}
