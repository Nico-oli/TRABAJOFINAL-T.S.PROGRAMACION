// Barra de acción en lote + diálogos de confirmación/resultado para
// "Mover al siguiente curso" (Feature de selección múltiple en
// admin/alumnos.html). Cada alumno se mueve con una llamada independiente
// a alumnoService.actualizarSeguro — si alguna falla, las demás no se ven
// afectadas (Promise.allSettled), y el resultado final ("X movidos, Y
// fallaron") se muestra siempre, nunca se deja la operación a medias sin
// avisar.
import { cursoService } from '../services/cursoService.js';
import { alumnoService } from '../services/alumnoService.js';
import { ApiError } from '../services/httpClient.js';

export function initMoveCourseBar({ getSelectedIds, getStudentLabel, onExitSelection, onMoved }) {
  const bar = document.getElementById('bulk-bar');
  if (!bar) return null;

  const countEl = document.getElementById('bulk-bar-count');
  const cursoSelect = document.getElementById('bulk-bar-curso');
  const moveBtn = document.getElementById('bulk-bar-move-btn');
  const cancelBtn = document.getElementById('bulk-bar-cancel-btn');

  const confirmBackdrop = document.getElementById('move-confirm-backdrop');
  const confirmBody = document.getElementById('move-confirm-body');
  const confirmCancelBtn = document.getElementById('move-confirm-cancel-btn');
  const confirmOkBtn = document.getElementById('move-confirm-ok-btn');

  const resultBackdrop = document.getElementById('move-result-backdrop');
  const resultBody = document.getElementById('move-result-body');
  const resultCloseBtn = document.getElementById('move-result-close-btn');

  let cursosCache = [];

  async function populateCursos() {
    cursoSelect.innerHTML = '<option value="">Elegir curso destino...</option>';
    try {
      cursosCache = await cursoService.getAll();
      cursosCache.forEach((c) => {
        const opt = document.createElement('option');
        opt.value = String(c.id);
        opt.textContent = `${c.nombre}${c.turno ? ' · ' + c.turno : ''}`;
        cursoSelect.appendChild(opt);
      });
    } catch {
      cursoSelect.innerHTML = '<option value="">No se pudieron cargar los cursos</option>';
    }
  }

  function refresh() {
    const ids = getSelectedIds();
    if (!ids.length) {
      bar.hidden = true;
      return;
    }
    bar.hidden = false;
    countEl.textContent = `${ids.length} seleccionado${ids.length === 1 ? '' : 's'}`;
    moveBtn.disabled = !cursoSelect.value;
  }

  cursoSelect.addEventListener('change', () => {
    moveBtn.disabled = !cursoSelect.value;
  });

  cancelBtn.addEventListener('click', () => {
    onExitSelection();
  });

  moveBtn.addEventListener('click', () => {
    const ids = getSelectedIds();
    const curso = cursosCache.find((c) => String(c.id) === cursoSelect.value);
    confirmBody.textContent = `Mover ${ids.length} alumno${ids.length === 1 ? '' : 's'} a "${curso ? curso.nombre : 'el curso elegido'}".`;
    confirmBackdrop.hidden = false;
  });

  confirmCancelBtn.addEventListener('click', () => {
    confirmBackdrop.hidden = true;
  });

  confirmOkBtn.addEventListener('click', async () => {
    confirmOkBtn.disabled = true;
    const ids = getSelectedIds();
    const idCurso = Number(cursoSelect.value);

    const results = await Promise.allSettled(
      ids.map((id) => alumnoService.actualizarSeguro(id, { idCurso })),
    );

    const exitosos = [];
    const fallidos = [];
    results.forEach((r, i) => {
      if (r.status === 'fulfilled') exitosos.push(ids[i]);
      else fallidos.push({ id: ids[i], error: r.reason });
    });

    confirmBackdrop.hidden = true;
    confirmOkBtn.disabled = false;

    const exitosLabel = `${exitosos.length} alumno${exitosos.length === 1 ? '' : 's'} movido${exitosos.length === 1 ? '' : 's'} correctamente.`;
    const fallosLabel = fallidos.length
      ? `<p style="color:var(--color-accent-800)">${fallidos.length} fallaron:</p><ul style="margin:0;padding-left:18px;font-size:13px">${fallidos
          .map((f) => `<li>${getStudentLabel(f.id)} — ${f.error instanceof ApiError ? f.error.message : 'error desconocido'}</li>`)
          .join('')}</ul>`
      : '';
    resultBody.innerHTML = `<p>${exitosLabel}</p>${fallosLabel}`;
    resultBackdrop.hidden = false;

    await onMoved({ exitosos, fallidos });
  });

  resultCloseBtn.addEventListener('click', () => {
    resultBackdrop.hidden = true;
  });

  return { refresh, populateCursos };
}
