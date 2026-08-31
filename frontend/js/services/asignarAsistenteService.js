import { http } from './httpClient.js';

// TODO: el mockup no tiene ninguna pantalla para asignar/desasignar
// asistentes a un curso (el campo "asistente" de las cards de curso se
// muestra de sólo lectura, viene armado en CursoResponse.asistentes).
// Este service queda listo para cuando se agregue esa pantalla al diseño.
export const asignarAsistenteService = {
  // POST /api/admin/usuario/{idUsuario}/curso/{idCurso}
  asignar(idUsuario, idCurso) {
    return http.post(`/admin/usuario/${idUsuario}/curso/${idCurso}`);
  },

  // DELETE /api/admin/usuario/{idUsuario}/curso/{idCurso}
  quitar(idUsuario, idCurso) {
    return http.delete(`/admin/usuario/${idUsuario}/curso/${idCurso}`);
  },

  // DELETE /api/admin/usuario/{idUsuario} — baja lógica de un asistente.
  // El backend rechaza con 400 si todavía tiene cursos asignados (hay que
  // desasignarlos antes, mismo criterio que cursoService.darDeBaja).
  darDeBaja(idUsuario) {
    return http.delete(`/admin/usuario/${idUsuario}`);
  },
};
