import { bootApp } from '../app.js';
import { authService } from '../services/authService.js';
import { asignarAsistenteService } from '../services/asignarAsistenteService.js';
import { initAssistantFormDialog } from '../components/assistant-form-dialog.js';
import { initAssignCoursesDialog } from '../components/assign-courses-dialog.js';
import { initConfirmDialog } from '../components/confirm-dialog.js';
import { showToast } from '../components/toast.js';
import { ApiError } from '../services/httpClient.js';

const session = bootApp({ currentPage: 'admin-asistentes', requiredRole: 'ADMINISTRADOR', screenTitle: 'Asistentes' });
if (session) init();

async function init() {
  const assignDialog = initAssignCoursesDialog({
    onSaved: async () => {
      showToast('Cursos actualizados con éxito');
      await loadAsistentes(assignDialog, bajaDialog);
    },
  });

  const bajaDialog = initConfirmDialog({
    backdropId: 'confirm-baja-backdrop',
    titleId: 'confirm-baja-title',
    messageId: 'confirm-baja-message',
    errorId: 'confirm-baja-error',
    cancelBtnId: 'confirm-baja-cancel-btn',
    confirmBtnId: 'confirm-baja-confirm-btn',
  });

  initAssistantFormDialog({
    onConfirm: async (dto) => {
      await authService.register(dto);
      showToast('Asistente creado con éxito');
      await loadAsistentes(assignDialog, bajaDialog);
    },
  });

  await loadAsistentes(assignDialog, bajaDialog);
}

async function loadAsistentes(assignDialog, bajaDialog) {
  const list = document.getElementById('assistant-list');
  const errorEl = document.getElementById('assistant-list-error');
  errorEl.hidden = true;

  try {
    const asistentes = await asignarAsistenteService.listar();

    if (!asistentes.length) {
      list.innerHTML = '<p class="list-row-empty">Todavía no hay asistentes creados.</p>';
      return;
    }

    list.innerHTML = '';
    asistentes.forEach((asistente) => {
      list.appendChild(renderRow(asistente, assignDialog, bajaDialog));
    });
  } catch (err) {
    errorEl.textContent = err instanceof ApiError ? err.message : 'No se pudieron cargar los asistentes.';
    errorEl.hidden = false;
  }
}

function renderRow(asistente, assignDialog, bajaDialog) {
  const row = document.createElement('div');
  row.className = 'list-row';

  const left = document.createElement('div');
  const title = document.createElement('div');
  title.className = 'list-row-title';
  title.textContent = `${asistente.nombre} ${asistente.apellido}`;
  left.appendChild(title);

  const subtitle = document.createElement('div');
  subtitle.className = 'list-row-subtitle';
  subtitle.textContent = asistente.email;
  left.appendChild(subtitle);

  const cursos = asistente.cursosAsignados ?? [];
  const tagsWrap = document.createElement('div');
  tagsWrap.style.display = 'flex';
  tagsWrap.style.flexWrap = 'wrap';
  tagsWrap.style.gap = '4px';
  tagsWrap.style.marginTop = '4px';

  if (cursos.length) {
    cursos.forEach((c) => {
      const tag = document.createElement('span');
      tag.className = 'tag tag-neutral';
      tag.textContent = c.nombre;
      tagsWrap.appendChild(tag);
    });
  } else {
    const tag = document.createElement('span');
    tag.className = 'tag tag-outline';
    tag.textContent = 'sin cursos asignados';
    tagsWrap.appendChild(tag);
  }
  left.appendChild(tagsWrap);

  row.appendChild(left);

  const actions = document.createElement('div');
  actions.style.display = 'flex';
  actions.style.gap = 'var(--space-2)';
  actions.style.flexShrink = '0';

  const assignBtn = document.createElement('button');
  assignBtn.className = 'btn btn-secondary';
  assignBtn.textContent = 'Asignar cursos';
  assignBtn.addEventListener('click', () => {
    assignDialog?.open(asistente);
  });
  actions.appendChild(assignBtn);

  const bajaBtn = document.createElement('button');
  bajaBtn.className = 'btn btn-secondary';
  bajaBtn.textContent = 'Dar de baja';
  bajaBtn.addEventListener('click', () => {
    bajaDialog?.open({
      title: 'Dar de baja asistente',
      message: `¿Confirmás dar de baja a ${asistente.nombre} ${asistente.apellido}?`,
      onConfirm: async () => {
        await asignarAsistenteService.darDeBaja(asistente.id);
        showToast('Asistente dado de baja con éxito');
        await loadAsistentes(assignDialog, bajaDialog);
      },
    });
  });
  actions.appendChild(bajaBtn);

  row.appendChild(actions);

  return row;
}
