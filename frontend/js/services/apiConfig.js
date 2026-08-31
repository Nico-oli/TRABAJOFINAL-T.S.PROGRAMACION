// Config de la API REST del backend Spring Boot.
//
// Cambiar de entorno: editar ACTIVE_ENV más abajo (o agregar una entrada
// nueva a ENVIRONMENTS).
//
// IMPORTANTE: el backend sólo acepta requests desde los orígenes listados
// en app.cors.allowed-origins (application.properties), que por defecto
// son http://localhost:3000 y http://localhost:5173. Si servís este
// frontend desde otro puerto/host, agregalo ahí (variable de entorno
// CORS_ALLOWED_ORIGINS) — este archivo no puede tocar esa configuración.

const ENVIRONMENTS = {
  local: 'http://localhost:8080/api',
  // TODO: reemplazar por la URL real una vez que el backend esté desplegado.
  produccion: 'https://TODO-completar-url-produccion/api',
};

const ACTIVE_ENV = 'local';

export const API_BASE_URL = ENVIRONMENTS[ACTIVE_ENV];

// Reglas de inasistencias: NO se hardcodean acá. AlumnoResponse trae
// limiteFaltasEfectivo/avisoFaltasEfectivo ya calculados por alumno (límite
// base de application.properties + faltasAdicionalesOtorgadas por
// reincorporación paga — ver AlumnoFaltasService en el backend). Antes este
// archivo exportaba ATTENDANCE_LIMIT/ATTENDANCE_WARN fijos en 15/12, que
// ignoraban el cupo otorgado por reincorporación: un alumno reincorporado
// con +5 seguía viéndose "Excedido"/"15 faltas" en vez de "15/20". Usar
// siempre los campos que vienen en cada AlumnoResponse, nunca un valor fijo
// acá.
