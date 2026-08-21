import { http } from './httpClient.js';

// AsistenciaRequest: { idAlumno, idCurso, estadoAsistencia: 'PRESENTE'|'AUSENTE'|'JUSTIFICADO', observacion }
// AsistenciaResponse: { alumno, curso, fecha, observacion, nombreAsistente }
export const asistenciaService = {
  // POST /api/asistencias/asistencia — guarda la asistencia del día para una lista
  // de alumnos de un curso (rol ASISTENTE, ahora también ADMINISTRADOR — ver
  // nota de seguridad más abajo). Body: AsistenciaRequest[].
  //
  // NOTA: hasta "urls con security config" este endpoint sólo lo podía
  // llamar ASISTENTE (@PreAuthorize("hasRole('ASISTENTE')") a nivel de
  // método). Al migrar la autorización a reglas por URL en SecurityConfig
  // (/api/asistencias/** = ADMINISTRADOR o ASISTENTE), quedó accesible
  // también para ADMINISTRADOR. Verificado contra el backend real.
  guardar(registros) {
    return http.post('/asistencias/asistencia', registros);
  },

  // PATCH /api/admin/asistencia/{idAsistencia} — cambia el estado de una
  // asistencia puntual (rol ADMINISTRADOR). Body: uno de
  // 'PRESENTE' | 'AUSENTE' | 'JUSTIFICADO' (el enum como string JSON).
  actualizarEstado(idAsistencia, estado) {
    return http.patch(`/admin/asistencia/${idAsistencia}`, estado);
  },

  // DELETE /api/admin/asistencia/{idAsistencia}
  eliminar(idAsistencia) {
    return http.delete(`/admin/asistencia/${idAsistencia}`);
  },

  // DELETE /api/admin/asistencia/cambioAnual — limpia asistencias de años anteriores.
  eliminarPorCambioAnual() {
    return http.delete('/admin/asistencia/cambioAnual');
  },

  // POST /api/admin/asistencia/{idCurso} — trae las asistencias de un curso en
  // una fecha puntual (rol ADMINISTRADOR).
  //
  // "urls con security config" cambió este endpoint de GET a POST (seguía
  // siendo un GET con body, lo cual no es un patrón HTTP estándar; ahora
  // al menos el verbo es coherente con que lleva body). Ningún screen del
  // mockup consume este endpoint todavía (la "Tomar asistencia" del
  // asistente arma la lista a partir del roster del curso, no de
  // asistencias ya tomadas).
  getPorFecha(idCurso, fechaIso) {
    return http.post(`/admin/asistencia/${idCurso}`, fechaIso);
  },
};
