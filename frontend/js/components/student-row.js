// El backend es la única fuente de verdad del límite de faltas de cada
// alumno: AlumnoResponse trae limiteFaltasEfectivo/avisoFaltasEfectivo ya
// calculados (límite/aviso base + faltasAdicionalesOtorgadas por
// reincorporación paga — ver AlumnoFaltasService). Antes acá se comparaba
// contra ATTENDANCE_LIMIT/ATTENDANCE_WARN, constantes fijas en
// apiConfig.js que ignoraban por completo el cupo otorgado por
// reincorporación (un alumno reincorporado con +5 seguía viéndose
// "Excedido" a las 15 faltas en vez de a las 20). Ya no se usan esas
// constantes en ningún lado del frontend.
//
// Fiel al mockup: no hay token ámbar en el sistema "Industry" (ver
// variables.css), así que "En riesgo"/"Excedido" usan variantes del
// mismo azul-grisáceo de acento en vez de un color de warning nuevo.
export function estadoFor(inAsistencias, limiteFaltasEfectivo, avisoFaltasEfectivo) {
  if (inAsistencias >= limiteFaltasEfectivo) return { label: 'Excedido', tagClass: 'tag tag-accent' };
  if (inAsistencias >= avisoFaltasEfectivo) return { label: 'En riesgo', tagClass: 'tag tag-outline' };
  return { label: 'Regular', tagClass: 'tag tag-neutral' };
}

// Fila de alumno (usada en Alumnos y en el roster de un Curso). Si no se
// pasa `courseName` no se muestra la segunda línea, como en el roster de
// curso del mockup (ahí el curso ya está implícito por el contexto).
//
// `selectable` (opcional, default false) activa el modo selección múltiple
// (ver admin-alumnos.js / Feature "mover al siguiente curso"): la fila deja
// de ser un link navegable y pasa a ser un toggle de selección con un
// checkbox a la izquierda. Sin `selectable`, el comportamiento es idéntico
// al de siempre — no afecta a curso.html ni a ningún otro caller existente.
export function renderStudentRow({
  nombre, apellido, courseName, inAsistencias, limiteFaltasEfectivo, avisoFaltasEfectivo, href,
  selectable = false, selected = false, onToggleSelect,
}) {
  const estado = estadoFor(inAsistencias, limiteFaltasEfectivo, avisoFaltasEfectivo);

  const row = document.createElement(selectable ? 'div' : 'a');
  row.className = 'list-row' + (selectable ? '' : ' list-row-clickable');
  if (selectable) {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => onToggleSelect?.());
  } else {
    row.href = href;
  }

  const left = document.createElement('div');
  const title = document.createElement('div');
  title.className = 'list-row-title';
  title.textContent = `${nombre} ${apellido}`;
  left.appendChild(title);
  if (courseName) {
    const subtitle = document.createElement('div');
    subtitle.className = 'list-row-subtitle';
    subtitle.textContent = courseName;
    left.appendChild(subtitle);
  }

  const tag = document.createElement('span');
  tag.className = estado.tagClass;
  tag.textContent = estado.label;

  if (selectable) {
    const leftWrapper = document.createElement('div');
    leftWrapper.style.display = 'flex';
    leftWrapper.style.alignItems = 'center';
    leftWrapper.style.gap = 'var(--space-2)';

    const checkbox = document.createElement('span');
    checkbox.className = 'row-checkbox' + (selected ? ' is-selected' : '');
    checkbox.innerHTML = '<span class="box">✓</span>';

    leftWrapper.appendChild(checkbox);
    leftWrapper.appendChild(left);
    row.appendChild(leftWrapper);
  } else {
    row.appendChild(left);
  }
  row.appendChild(tag);
  return row;
}
