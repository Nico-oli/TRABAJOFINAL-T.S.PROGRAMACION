import { ATTENDANCE_LIMIT, ATTENDANCE_WARN } from '../services/apiConfig.js';

// Fiel al mockup: no hay token ámbar en el sistema "Industry" (ver
// variables.css), así que "En riesgo"/"Excedido" usan variantes del
// mismo azul-grisáceo de acento en vez de un color de warning nuevo.
export function estadoFor(inAsistencias) {
  if (inAsistencias >= ATTENDANCE_LIMIT) return { label: 'Excedido', tagClass: 'tag tag-accent' };
  if (inAsistencias >= ATTENDANCE_WARN) return { label: 'En riesgo', tagClass: 'tag tag-outline' };
  return { label: 'Regular', tagClass: 'tag tag-neutral' };
}

// Fila de alumno (usada en Alumnos y en el roster de un Curso). Si no se
// pasa `courseName` no se muestra la segunda línea, como en el roster de
// curso del mockup (ahí el curso ya está implícito por el contexto).
export function renderStudentRow({ nombre, apellido, courseName, inAsistencias, href }) {
  const estado = estadoFor(inAsistencias);

  const row = document.createElement('a');
  row.className = 'list-row list-row-clickable';
  row.href = href;

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

  row.appendChild(left);
  row.appendChild(tag);
  return row;
}
