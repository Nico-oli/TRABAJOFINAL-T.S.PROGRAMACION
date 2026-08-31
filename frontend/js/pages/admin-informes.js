import { bootApp } from '../app.js';
import { cursoService } from '../services/cursoService.js';
import { alumnoService } from '../services/alumnoService.js';
import { renderStatTile } from '../components/stat-tile.js';
import { ApiError } from '../services/httpClient.js';

// TODO: el mockup de diseño calcula "Asistencia prom." como
// round(((totalDias - faltas) / totalDias) * 100) con un totalDias fijo
// de demo (40). El backend no expone ningún concepto de "días de clase
// totales" (ni en CursoResponse ni en AlumnoResponse), así que ese
// porcentaje no se puede calcular de verdad sin inventar un número. En
// su lugar, este informe muestra cuántas faltas tiene cada alumno en
// relación al límite (--color-accent width = faltas/límite), y el
// promedio de faltas del curso en vez de un "% de asistencia".

const session = bootApp({ currentPage: 'admin-informes', requiredRole: 'ADMINISTRADOR', screenTitle: 'Informes' });
if (session) init();

async function init() {
  const select = document.getElementById('report-course-select');
  const statsEl = document.getElementById('report-stats');
  const rowsEl = document.getElementById('report-rows');
  const errorEl = document.getElementById('report-error');

  let cursos = [];
  try {
    cursos = await cursoService.getAll();
  } catch (err) {
    errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudieron cargar los cursos.';
    errorEl.hidden = false;
    return;
  }

  if (!cursos.length) {
    errorEl.textContent = 'Todavía no hay cursos creados.';
    errorEl.hidden = false;
    return;
  }

  select.innerHTML = cursos.map((c) => `<option value="${c.id}">${c.nombre}</option>`).join('');
  select.addEventListener('change', () => loadReport(select.value));
  loadReport(cursos[0].id);

  async function loadReport(idCurso) {
    try {
      const roster = await alumnoService.getPorCurso(idCurso);

      const promedioFaltas = roster.length
        ? Math.round((roster.reduce((sum, a) => sum + a.inAsistencias, 0) / roster.length) * 10) / 10
        : 0;

      statsEl.innerHTML = '';
      statsEl.appendChild(renderStatTile({ label: 'Faltas prom.', value: promedioFaltas }));
      statsEl.appendChild(renderStatTile({ label: 'Alumnos', value: roster.length }));

      rowsEl.innerHTML = roster
        .map((a) => {
          // limiteFaltasEfectivo viene del backend por alumno (límite base +
          // faltasAdicionalesOtorgadas por reincorporación) — antes esto
          // usaba ATTENDANCE_LIMIT fijo, así que un alumno reincorporado con
          // +5/+10/+15 seguía mostrando "X/15" en vez de su límite real.
          const pct = Math.min(100, Math.round((a.inAsistencias / a.limiteFaltasEfectivo) * 100));
          return `
            <div class="report-row">
              <div class="report-row-head">
                <span>${a.nombre} ${a.apellido}</span><span>${a.inAsistencias}/${a.limiteFaltasEfectivo}</span>
              </div>
              <div class="progress"><span style="width:${pct}%"></span></div>
            </div>
          `;
        })
        .join('') || '<p class="list-row-empty">Este curso todavía no tiene alumnos.</p>';
    } catch (err) {
      errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudo cargar el informe.';
      errorEl.hidden = false;
    }
  }
}
