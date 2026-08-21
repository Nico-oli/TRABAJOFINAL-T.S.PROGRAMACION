import { http } from './httpClient.js';

// CursoResponse: { id, nombre, anioLectivo, turno, asistentes: string[] }
// Nota: CursoResponse no trae la cantidad de alumnos del curso — no hay
// un endpoint de resumen para eso, ver alumnoService.contarPorCurso().
export const cursoService = {
  // GET /api/asistencias/curso — devuelve todos los cursos si es ADMINISTRADOR, o
  // sólo los cursos asignados si es ASISTENTE (filtrado server-side).
  getAll() {
    return http.get('/asistencias/curso');
  },

  // POST /api/admin/curso — { nombre, anioLectivo, turno }
  create(dto) {
    return http.post('/admin/curso', dto);
  },

  // PATCH /api/admin/curso/{idCurso} — { nombre?, anioLectivo?, turno? }
  actualizar(idCurso, dto) {
    return http.patch(`/admin/curso/${idCurso}`, dto);
  },

  // DELETE /api/admin/curso/{idCurso} — baja lógica
  darDeBaja(idCurso) {
    return http.delete(`/admin/curso/${idCurso}`);
  },
};
