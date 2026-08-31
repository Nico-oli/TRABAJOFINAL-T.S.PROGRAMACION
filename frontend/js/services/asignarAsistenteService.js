import { http } from './httpClient.js';

// Gestión de Asistentes desde la pantalla Admin > Asistentes.
export const asignarAsistenteService = {
  // GET /api/admin/usuario/asistentes -> AsistenteResponse[]
  // { id, nombre, apellido, email, cursosAsignados: [{ id, nombre }] }
  listar() {
    return http.get('/admin/usuario/asistentes');
  },

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
