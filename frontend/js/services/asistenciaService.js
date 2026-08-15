import { http } from './httpClient.js';

// AsistenciaRequest: { idAlumno, idCurso, estadoAsistencia: 'PRESENTE'|'AUSENTE'|'JUSTIFICADO', observacion }
// AsistenciaResponse: { alumno, curso, fecha, observacion, nombreAsistente }
export const asistenciaService = {
  // POST /api/asistencia — guarda la asistencia del día para una lista
  // de alumnos de un curso (rol ASISTENTE). Body: AsistenciaRequest[].
  guardar(registros) {
    return http.post('/asistencia', registros);
  },

  // PATCH /api/asistencia/{idAsistencia} — cambia el estado de una
  // asistencia puntual (rol ADMINISTRADOR). Body: uno de
  // 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO' (el enum como string JSON).
  actualizarEstado(idAsistencia, estado) {
    return http.patch(`/asistencia/${idAsistencia}`, estado);
  },

  // DELETE /api/asistencia/{idAsistencia}
  eliminar(idAsistencia) {
    return http.delete(`/asistencia/${idAsistencia}`);
  },

  // DELETE /api/asistencia/cambioAnual — limpia asistencias de años anteriores.
  eliminarPorCambioAnual() {
    return http.delete('/asistencia/cambioAnual');
  },

  // GET /api/asistencia/{idCurso} — trae las asistencias de un curso en
  // una fecha puntual (rol ADMINISTRADOR).
  //
  // TODO: tal como está definido en el backend, este endpoint es GET pero
  // espera la fecha en el body de la request (@RequestBody LocalDate),
  // no como query param. Un body en un GET es válido para fetch() pero
  // no es un patrón HTTP estándar (algunos proxies/intermediarios lo
  // descartan) — queda documentado acá tal cual está el contrato actual
  // del backend, sin improvisar un query param que el backend no lee.
  // Además ninguna pantalla del mockup consume este endpoint todavía
  // (la "Tomar asistencia" del asistente arma la lista a partir del
  // roster del curso, no de asistencias ya tomadas).
  getPorFecha(idCurso, fechaIso) {
    return http.get(`/asistencia/${idCurso}`, { body: fechaIso });
  },
};
