import { bootApp } from '../app.js';
import { cursoService } from '../services/cursoService.js';
import { alumnoService } from '../services/alumnoService.js';
import { renderStatTile } from '../components/stat-tile.js';
import { estadoFor } from '../components/student-row.js';
import { ATTENDANCE_WARN } from '../services/apiConfig.js';
import { ApiError } from '../services/httpClient.js';

const session = bootApp({ currentPage: 'admin-inicio', requiredRole: 'ADMINISTRADOR', screenTitle: 'Inicio' });
if (session) init();

async function init() {
  const statsEl = document.getElementById('home-stats');
  const alertsSection = document.getElementById('home-alerts-section');
  const alertsCountEl = document.getElementById('home-alerts-count');
  const alertsListEl = document.getElementById('home-alerts-list');
  const errorEl = document.getElementById('home-error');

  try {
    // No hay un endpoint que devuelva todos los alumnos de una: se arma
    // a partir del roster de cada curso (ver alumnoService.contarPorCurso
    // para la misma limitación).
    const cursos = await cursoService.getAll();
    const rosters = await Promise.all(cursos.map((c) => alumnoService.getPorCurso(c.id)));
    const alumnos = rosters.flatMap((roster, i) => roster.map((a) => ({ ...a, courseName: cursos[i].nombre })));

    statsEl.innerHTML = '';
    statsEl.appendChild(renderStatTile({ label: 'Alumnos', value: alumnos.length }));
    statsEl.appendChild(renderStatTile({ label: 'Cursos', value: cursos.length }));

    const alerts = alumnos
      .filter((a) => a.inAsistencias >= ATTENDANCE_WARN)
      .sort((a, b) => b.inAsistencias - a.inAsistencias);

    if (!alerts.length) {
      alertsSection.hidden = true;
      return;
    }
    alertsSection.hidden = false;
    alertsCountEl.textContent = `(${alerts.length})`;
    alertsListEl.innerHTML = '';
    alerts.forEach((a) => {
      const estado = estadoFor(a.inAsistencias);
      const row = document.createElement('a');
      row.className = 'list-row list-row-clickable';
      row.href = `../admin/alumno.html?id=${a.id}`;
      row.innerHTML = `
        <div>
          <div class="list-row-title">${a.nombre} ${a.apellido}</div>
          <div class="list-row-subtitle">${a.courseName}</div>
        </div>
        <span class="${estado.tagClass}">${a.inAsistencias} faltas</span>
      `;
      alertsListEl.appendChild(row);
    });
  } catch (err) {
    errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudo cargar el inicio.';
    errorEl.hidden = false;
  }
}
