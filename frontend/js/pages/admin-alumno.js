import { bootApp } from '../app.js';
import { alumnoService } from '../services/alumnoService.js';
import { estadoFor } from '../components/student-row.js';
import { initJustifyDialog } from '../components/justify-dialog.js';
import { showToast } from '../components/toast.js';
import { ApiError } from '../services/httpClient.js';

const session = bootApp({ currentPage: 'admin-alumno', requiredRole: 'ADMINISTRADOR', screenTitle: 'Alumno' });
const idAlumno = new URLSearchParams(window.location.search).get('id');

if (session && idAlumno) init();
else if (session) window.location.href = './alumnos.html';

document.getElementById('back-to-students-btn').addEventListener('click', () => {
  window.location.href = './alumnos.html';
});

async function init() {
  const cardEl = document.getElementById('student-card');
  const historyEl = document.getElementById('student-history');
  const errorEl = document.getElementById('student-error');

  let alumno;
  try {
    alumno = await alumnoService.getUno(idAlumno);
  } catch (err) {
    errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudo cargar el alumno.';
    errorEl.hidden = false;
    return;
  }

  renderCard(alumno);
  renderHistory(alumno);

  initJustifyDialog({
    studentName: `${alumno.nombre} ${alumno.apellido}`,
    onConfirm: async () => {
      try {
        // Ver TODO en components/justify-dialog.js: sólo se puede
        // decrementar el conteo de faltas, fecha/motivo no se persisten.
        const nuevasFaltas = Math.max(0, alumno.inAsistencias - 1);
        await alumnoService.actualizar(idAlumno, { faltas: nuevasFaltas });
        // El PATCH no devuelve "asistencias" (viene null ahí, sólo se
        // completa en una consulta puntual) — se vuelve a pedir el
        // alumno completo para que el historial no parpadee a "Sin
        // registros" con datos que sí existen.
        alumno = await alumnoService.getUno(idAlumno);
        renderCard(alumno);
        renderHistory(alumno);
        showToast('Falta justificada correctamente');
      } catch (err) {
        showToast(err instanceof ApiError ? err.message : 'No se pudo justificar la falta.');
      }
    },
  });

  function renderCard(a) {
    const estado = estadoFor(a.inAsistencias);
    cardEl.innerHTML = `
      <div class="card-title">${a.nombre} ${a.apellido}</div>
      <div class="card-body">${a.curso?.nombre ?? ''}</div>
      <div style="display:flex;gap:8px;align-items:center;margin-top:6px">
        <span class="${estado.tagClass}">${estado.label}</span>
        <span class="text-muted" style="font-size:12px">${a.inAsistencias} faltas registradas</span>
      </div>
    `;
  }

  function renderHistory(a) {
    const registros = a.asistencias ?? [];
    if (!registros.length) {
      historyEl.innerHTML = '<p class="list-row-empty">Sin registros de asistencia todavía.</p>';
      return;
    }
    // TODO: AsistenciaResponse no devuelve el estado (Presente/Ausente/
    // Justificado) de cada registro, sólo fecha/observación/asistente —
    // ver Mappers/AsistenciaMapper.toResponse en el backend. Por eso acá
    // no se puede mostrar el tag de estado que tenía el mockup por fila;
    // se muestra lo que la API sí devuelve.
    historyEl.innerHTML = registros
      .slice()
      .sort((r1, r2) => new Date(r2.fecha) - new Date(r1.fecha))
      .map((r) => `
        <div class="list-row">
          <span>${r.fecha}</span>
          <span class="text-muted" style="font-size:12px">${r.observacion ?? r.nombreAsistente ?? ''}</span>
        </div>
      `)
      .join('');
  }
}
