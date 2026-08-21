// Card de curso — "Mis cursos" (Asistente) y "Cursos" (Administrador)
// del mockup comparten la misma tarjeta pero con contenido/acción
// distintos: el Asistente ve un botón "Tomar asistencia" que lleva a la
// pantalla de asistencia; el Administrador tapea la tarjeta entera para
// ver el detalle del curso.

// TODO: el mockup muestra un tag "Asistencia registrada hoy" cuando ya
// se tomó asistencia. El backend no expone (para el rol ASISTENTE) una
// forma de saber si ya se tomó asistencia hoy para un curso — el único
// endpoint relacionado (GET /api/asistencia/{idCurso}) es exclusivo de
// ADMINISTRADOR (ver asistenciaService.getPorFecha). Por eso esta card
// siempre muestra "Tomar asistencia", nunca el estado "ya tomada".

export function renderAsistenteCourseCard({ id, nombre, turno, alumnosCount }) {
  const card = document.createElement('div');
  card.className = 'card elev-sm';

  card.innerHTML = `
    <div class="card-kicker">${turno ?? ''}</div>
    <div class="card-title">${nombre}</div>
    <div class="card-meta">${alumnosCount} alumnos</div>
  `;

  const btn = document.createElement('a');
  btn.className = 'btn btn-primary btn-block';
  btn.href = `./asistencia.html?curso=${id}`;
  btn.textContent = 'Tomar asistencia';
  card.appendChild(btn);

  return card;
}

export function renderAdminCourseCard({ id, nombre, turno, alumnosCount, asistentes }) {
  const card = document.createElement('a');
  card.className = 'card elev-sm card-clickable';
  card.href = `./curso.html?id=${id}`;

  const asistenteLabel = asistentes && asistentes.length ? asistentes.join(', ') : 'sin asistente asignado';
  card.innerHTML = `
    <div class="card-kicker">${turno ?? ''}</div>
    <div class="card-title">${nombre}</div>
    <div class="card-meta">${alumnosCount} alumnos · ${asistenteLabel}</div>
  `;

  return card;
}
