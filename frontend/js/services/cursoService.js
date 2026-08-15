import { http } from './httpClient.js';

// CursoResponse: { id, nombre, anioLectivo, turno, asistentes: string[] }
// Nota: CursoResponse no trae la cantidad de alumnos del curso — no hay
// un endpoint de resumen para eso, ver alumnoService.contarPorCurso().
export const cursoService = {
  // GET /api/curso — devuelve todos los cursos si es ADMINISTRADOR, o
  // sólo los cursos asignados si es ASISTENTE (filtrado server-side).
  getAll() {
    return http.get('/curso');
  },

  // POST /api/curso — { nombre, anioLectivo, turno }
  create(dto) {
    return http.post('/curso', dto);
  },

  // PATCH /api/curso/{idCurso} — { nombre?, anioLectivo?, turno? }
  actualizar(idCurso, dto) {
    return http.patch(`/curso/${idCurso}`, dto);
  },

  // DELETE /api/curso/{idCurso} — baja lógica
  darDeBaja(idCurso) {
    return http.delete(`/curso/${idCurso}`);
  },
};
