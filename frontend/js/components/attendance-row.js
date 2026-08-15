// Fila de "Tomar asistencia": nombre del alumno + casillero cuadrado que
// se togglea entre presente/ausente al tocarlo (igual que el mockup).
export function renderAttendanceRow({ nombre, absent }, onToggle) {
  const row = document.createElement('div');
  row.className = 'list-row';

  const name = document.createElement('span');
  name.className = 'list-row-title';
  name.textContent = nombre;

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'attendance-toggle' + (absent ? ' is-absent' : '');
  toggle.setAttribute('aria-label', 'Marcar ausente');
  toggle.innerHTML = '<span class="box">✕</span>';
  toggle.addEventListener('click', () => onToggle());

  row.appendChild(name);
  row.appendChild(toggle);
  return row;
}
