// Datos y router mock para PREVIEW_MODE (ver js/config.js). Sólo se usa
// cuando PREVIEW_MODE está en true — httpClient.js delega acá en vez de
// hacer fetch(). Cada handler devuelve exactamente lo que la API real
// devolvería en `data` (BaseResponse<T>.data), con la misma forma que
// CursoResponse/AlumnoResponse/LoginResponse/etc. del backend.
//
// El "match" de rutas es por regex sobre los segmentos del path (no
// comparación exacta de string), igual que rutea Spring con
// @PathVariable: /alumno/curso/{idCurso} matchea /alumno/curso/7,
// /alumno/curso/23, etc.

import { PREVIEW_ROL } from '../config.js';

export class MockNotFoundError extends Error {}

/** Simula un error real del backend (404, etc.) sin pasar por fetch. */
export class MockHttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// ── "base de datos" en memoria, mutable durante la sesión de preview ──
// (así "Guardar asistencia" y "Justificar falta" se reflejan al toque
// en las demás pantallas, sin persistir nada real).

const CURSOS = [
  { id: 1, nombre: 'Quinto Año A', anioLectivo: 5, turno: 'Mañana', asistentes: ['Gómez'] },
  { id: 2, nombre: 'Cuarto Año B', anioLectivo: 4, turno: 'Tarde', asistentes: ['Herrera'] },
  { id: 3, nombre: 'Sexto Año C', anioLectivo: 6, turno: 'Mañana', asistentes: ['Gómez'] },
];

// Mismos valores base que application.properties (app.alumno.limite-faltas /
// app.alumno.faltas-aviso) — sólo para que el modo preview arme
// limiteFaltasEfectivo/avisoFaltasEfectivo igual que el backend real.
const LIMITE_FALTAS_BASE = 15;
const FALTAS_AVISO_BASE = 12;

// Mismo dataset de demo que el mockup original (Attendance App.dc.html),
// para que el modo preview se vea igual de poblado que el diseño fuente.
const ALUMNOS = [
  { id: 1, nombre: 'Abril', apellido: 'Sosa', cursoId: 1, inAsistencias: 4, fechaNacimiento: '2009-03-14' },
  { id: 2, nombre: 'Bruno', apellido: 'Ibarra', cursoId: 1, inAsistencias: 9, fechaNacimiento: '2009-06-02' },
  { id: 3, nombre: 'Camila', apellido: 'Rojas', cursoId: 1, inAsistencias: 14, fechaNacimiento: '2009-01-21' },
  { id: 4, nombre: 'Diego', apellido: 'Funes', cursoId: 1, inAsistencias: 2, fechaNacimiento: '2009-09-10' },
  { id: 5, nombre: 'Elena', apellido: 'Paz', cursoId: 1, inAsistencias: 16, fechaNacimiento: '2009-04-05' },
  { id: 6, nombre: 'Franco', apellido: 'Aguirre', cursoId: 2, inAsistencias: 6, fechaNacimiento: '2010-02-18' },
  { id: 7, nombre: 'Gimena', apellido: 'Cabrera', cursoId: 2, inAsistencias: 3, fechaNacimiento: '2010-07-30' },
  { id: 8, nombre: 'Hernán', apellido: 'Díaz', cursoId: 2, inAsistencias: 13, fechaNacimiento: '2010-05-12' },
  { id: 9, nombre: 'Inés', apellido: 'Molina', cursoId: 2, inAsistencias: 1, fechaNacimiento: '2010-11-08' },
  { id: 10, nombre: 'Julián', apellido: 'Torres', cursoId: 3, inAsistencias: 5, fechaNacimiento: '2008-08-16' },
  { id: 11, nombre: 'Karen', apellido: 'Núñez', cursoId: 3, inAsistencias: 8, fechaNacimiento: '2008-12-01' },
  { id: 12, nombre: 'Lautaro', apellido: 'Vega', cursoId: 3, inAsistencias: 15, fechaNacimiento: '2008-03-27' },
  { id: 13, nombre: 'Marina', apellido: 'Ortiz', cursoId: 3, inAsistencias: 3, fechaNacimiento: '2008-10-09' },
  { id: 14, nombre: 'Nicolás', apellido: 'Paez', cursoId: 3, inAsistencias: 10, fechaNacimiento: '2008-06-23' },
];

function cursoResponse(cursoId) {
  const c = CURSOS.find((x) => x.id === cursoId);
  return c ? { ...c } : null;
}

function buildHistorial(alumno) {
  const dias = ['05/08', '06/08', '07/08', '08/08', '11/08', '12/08'];
  const patron = alumno.inAsistencias >= 15
    ? ['AUSENTE', 'AUSENTE', 'PRESENTE', 'AUSENTE', 'JUSTIFICADO', 'PRESENTE']
    : alumno.inAsistencias >= 12
      ? ['AUSENTE', 'PRESENTE', 'AUSENTE', 'PRESENTE', 'PRESENTE', 'AUSENTE']
      : ['PRESENTE', 'PRESENTE', 'AUSENTE', 'PRESENTE', 'PRESENTE', 'PRESENTE'];

  // TODO (ver TODO gemelo en js/pages/admin-alumno.js): AsistenciaResponse
  // real no devuelve el estado por fila, así que acá tampoco se expone —
  // se arma sólo para variar la observación mostrada, fiel a esa limitación.
  return dias.map((fecha, i) => ({
    alumno: null,
    curso: cursoResponse(alumno.cursoId),
    fecha,
    observacion: patron[i] === 'JUSTIFICADO' ? 'Certificado médico' : null,
    nombreAsistente: 'Prof. Gómez',
  }));
}

function toAlumnoResponse(alumno, { conAsistencias = false } = {}) {
  const otorgadas = alumno.faltasAdicionalesOtorgadas ?? 0;
  return {
    id: alumno.id,
    nombre: alumno.nombre,
    apellido: alumno.apellido,
    curso: cursoResponse(alumno.cursoId),
    fechaNacimiento: alumno.fechaNacimiento,
    inAsistencias: alumno.inAsistencias,
    asistencias: conAsistencias ? buildHistorial(alumno) : null,
    faltasAdicionalesOtorgadas: otorgadas,
    limiteFaltasEfectivo: LIMITE_FALTAS_BASE + otorgadas,
    avisoFaltasEfectivo: FALTAS_AVISO_BASE + otorgadas,
  };
}

// ── router ──

const ROUTES = [
  {
    method: 'POST',
    pattern: /^\/auth\/login$/,
    handler: (_m, body) => ({
      token: 'preview-mode-token',
      tipo: 'Bearer',
      usuario: {
        id: 0,
        nombre: 'Vista',
        apellido: 'Previa',
        email: body?.email ?? 'preview@local',
        rol: PREVIEW_ROL,
      },
    }),
  },
  // TODO: no hay pantalla que llame a /auth/register (ver authService.js).
  { method: 'POST', pattern: /^\/auth\/register$/, handler: () => null },

  { method: 'GET', pattern: /^\/curso$/, handler: () => CURSOS.map((c) => ({ ...c })) },
  { method: 'POST', pattern: /^\/curso$/, handler: () => null },
  { method: 'PATCH', pattern: /^\/curso\/(\d+)$/, handler: () => null },
  { method: 'DELETE', pattern: /^\/curso\/(\d+)$/, handler: () => null },

  {
    method: 'GET',
    pattern: /^\/alumno\/curso\/(\d+)$/,
    handler: (m) => ALUMNOS.filter((a) => a.cursoId === Number(m[1])).map((a) => toAlumnoResponse(a)),
  },
  {
    method: 'GET',
    pattern: /^\/alumno\/(\d+)$/,
    handler: (m) => {
      const alumno = ALUMNOS.find((a) => a.id === Number(m[1]));
      if (!alumno) throw new MockHttpError(404, 'Alumno no encontrado');
      return toAlumnoResponse(alumno, { conAsistencias: true });
    },
  },
  { method: 'POST', pattern: /^\/alumno$/, handler: () => null },
  {
    method: 'PATCH',
    pattern: /^\/alumno\/(\d+)$/,
    handler: (m, body) => {
      const alumno = ALUMNOS.find((a) => a.id === Number(m[1]));
      if (!alumno) throw new MockHttpError(404, 'Alumno no encontrado');
      if (body && typeof body.faltas === 'number') alumno.inAsistencias = body.faltas;
      return toAlumnoResponse(alumno, { conAsistencias: true });
    },
  },
  { method: 'DELETE', pattern: /^\/alumno\/(\d+)$/, handler: () => null },

  {
    method: 'POST',
    pattern: /^\/asistencia$/,
    handler: (_m, body) => {
      const registros = Array.isArray(body) ? body : [];
      registros.forEach((r) => {
        if (r.estadoAsistencia !== 'AUSENTE') return;
        const alumno = ALUMNOS.find((a) => a.id === Number(r.idAlumno));
        if (alumno) alumno.inAsistencias += 1;
      });
      return null;
    },
  },
  { method: 'PATCH', pattern: /^\/asistencia\/(\d+)$/, handler: () => null },
  { method: 'DELETE', pattern: /^\/asistencia\/cambioAnual$/, handler: () => null },
  { method: 'DELETE', pattern: /^\/asistencia\/(\d+)$/, handler: () => null },
  // TODO: ninguna pantalla llama a esto todavía (ver asistenciaService.getPorFecha).
  { method: 'GET', pattern: /^\/asistencia\/(\d+)$/, handler: () => [] },

  // TODO: sin pantalla para asignar/quitar asistentes (ver asignarAsistenteService.js).
  { method: 'POST', pattern: /^\/usuario\/(\d+)\/curso\/(\d+)$/, handler: () => null },
  { method: 'DELETE', pattern: /^\/usuario\/(\d+)\/curso\/(\d+)$/, handler: () => null },

  // TODO: sin pantalla para disparar el cambio de año lectivo (ver anualService.js).
  { method: 'POST', pattern: /^\/cambiarAnio$/, handler: () => null },
];

export async function resolveMockRequest(method, path, body) {
  const route = ROUTES.find((r) => r.method === method && r.pattern.test(path));
  if (!route) throw new MockNotFoundError(`[PREVIEW_MODE] sin mock para ${method} ${path}`);

  const match = path.match(route.pattern);
  return route.handler(match, body);
}
