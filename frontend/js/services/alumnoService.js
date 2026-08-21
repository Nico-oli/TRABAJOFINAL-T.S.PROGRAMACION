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
  // OJO: el backend tiene un bug conocido (ActualizarAlumno.java) que
  // explota con NullPointerException si el payload no manda nombre/apellido
  // (llama .isBlank() sin chequear null antes). No usar directo para updates
  // parciales — ver actualizarSeguro() más abajo, que es el único lugar
  // desde donde se debería llamar a esto para PATCHes parciales.
  actualizar(idAlumno, dto) {
    return http.patch(`/alumno/${idAlumno}`, dto);
  },

  // Envoltorio seguro para PATCHes parciales: hace GET primero, mezcla
  // `cambios` (sólo los campos que realmente cambian) sobre los datos
  // actuales del alumno, y manda el PATCH siempre completo — esquiva el
  // bug de arriba sin depender de que se arregle en el backend. Usar SIEMPRE
  // este método en vez de actualizar() para cualquier edición parcial.
  //
  // `adicional` no se expone en AlumnoResponse (no hay forma de leerlo desde
  // acá), pero mandarlo `null` es seguro: ActualizarAlumno sólo lo pisa si
  // el campo llega no-null.
  async actualizarSeguro(idAlumno, cambios) {
    const actual = await this.getUno(idAlumno);
    return this.actualizar(idAlumno, {
      nombre: cambios.nombre ?? actual.nombre,
      apellido: cambios.apellido ?? actual.apellido,
      idCurso: cambios.idCurso ?? actual.curso.id,
      faltas: cambios.faltas ?? actual.inAsistencias,
      adicional: cambios.adicional ?? null,
    });
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
