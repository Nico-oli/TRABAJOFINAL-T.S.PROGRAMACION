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

// Reglas de inasistencias — reflejan application.properties
// (app.alumno.limite-faltas / app.alumno.faltas-aviso). El backend no
// expone un endpoint para consultarlas, así que se mantienen
// sincronizadas acá a mano.
export const ATTENDANCE_LIMIT = 15;
export const ATTENDANCE_WARN = 12;

// TODO: application.properties también define un segundo umbral
// ("faltas adicionales": límite 20, aviso 17) y AlumnoActualizarRequest
// expone un campo `adicional`. El mockup de diseño no tiene ninguna
// pantalla ni estado visual para ese segundo nivel, así que no se
// implementa acá para no improvisar sobre el diseño fuente.
