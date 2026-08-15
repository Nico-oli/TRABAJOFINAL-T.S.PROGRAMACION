import { http } from './httpClient.js';

// AlumnoResponse: { id, nombre, apellido, curso: CursoResponse, fechaNacimiento,
//   inAsistencias, asistencias: AsistenciaResponse[] | null }
// `asistencias` sólo viene completo en getUno() (consulta puntual); en
// getPorCurso() queda en null y sólo viaja el conteo `inAsistencias`.
export const alumnoService = {
  // GET /api/alumno/curso/{idCurso}
  getPorCurso(idCurso) {
    return http.get(`/alumno/curso/${idCurso}`);
  },

  // GET /api/alumno/{idAlumno}
  getUno(idAlumno) {
    return http.get(`/alumno/${idAlumno}`);
  },

  // POST /api/alumno — { dni, nombre, apellido, fechaDeNacimiento, idCurso }
  create(dto) {
    return http.post('/alumno', dto);
  },

  // PATCH /api/alumno/{idAlumno} — { nombre?, apellido?, idCurso?, faltas?, adicional? }
  actualizar(idAlumno, dto) {
    return http.patch(`/alumno/${idAlumno}`, dto);
  },

  // DELETE /api/alumno/{idAlumno} — baja lógica
  eliminar(idAlumno) {
    return http.delete(`/alumno/${idAlumno}`);
  },

  // Helper de UI: no hay un endpoint de resumen por curso, así que la
  // cantidad de alumnos de cada curso (mostrada en las cards de "Cursos")
  // se resuelve pidiendo el roster completo y contando. Con pocos cursos
  // (uso típico del instituto) es aceptable; si el catálogo de cursos
  // creciera mucho convendría un endpoint dedicado en el backend.
  async contarPorCurso(idCurso) {
    const alumnos = await this.getPorCurso(idCurso);
    return alumnos.length;
  },
};
