import { bootApp } from '../app.js';
import { cursoService } from '../services/cursoService.js';
import { ApiError } from '../services/httpClient.js';

const session = bootApp({ currentPage: 'asistente-asistencia-guardada', requiredRole: 'ASISTENTE', screenTitle: 'Listo' });
const idCurso = new URLSearchParams(window.location.search).get('curso');

if (session && idCurso) init();
else if (session) window.location.href = './cursos.html';

document.getElementById('done-back-btn').addEventListener('click', () => {
  window.location.href = './cursos.html';
});

async function init() {
  const subtitleEl = document.getElementById('done-subtitle');
  try {
    const cursos = await cursoService.getAll();
    const curso = cursos.find((c) => String(c.id) === String(idCurso));
    const fecha = new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date());
    subtitleEl.textContent = `${curso ? curso.nombre : 'Curso'} · ${fecha}`;
  } catch (err) {
    subtitleEl.textContent = err instanceof ApiError ? err.message : '';
  }
}
