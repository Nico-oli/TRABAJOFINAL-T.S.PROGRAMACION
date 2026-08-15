// Tarjeta chica de estadística (Alumnos / Cursos / Asistencia prom.),
// usada en el dashboard de Administrador y en Informes.
export function renderStatTile({ label, value }) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="card-kicker">${label}</div>
    <div class="card-stat">${value}</div>
  `;
  return card;
}
