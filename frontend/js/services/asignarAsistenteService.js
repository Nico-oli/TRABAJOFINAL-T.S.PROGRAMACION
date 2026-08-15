import { http } from './httpClient.js';

// TODO: el mockup no tiene ninguna pantalla para asignar/desasignar
// asistentes a un curso (el campo "asistente" de las cards de curso se
// muestra de sólo lectura, viene armado en CursoResponse.asistentes).
// Este service queda listo para cuando se agregue esa pantalla al diseño.
export const asignarAsistenteService = {
  // POST /api/usuario/{idUsuario}/curso/{idCurso}
  asignar(idUsuario, idCurso) {
    return http.post(`/usuario/${idUsuario}/curso/${idCurso}`);
  },

  // DELETE /api/usuario/{idUsuario}/curso/{idCurso}
  quitar(idUsuario, idCurso) {
    return http.delete(`/usuario/${idUsuario}/curso/${idCurso}`);
  },
};
