// Config de desarrollo del frontend (no confundir con services/apiConfig.js,
// que define la base URL de la API real).
//
// PREVIEW_MODE: cuando está en true...
//   - el auth guard (bootApp en js/app.js) deja de exigir sesión y de
//     validar rol: se puede entrar directo por URL a cualquiera de las
//     12 pantallas de /asistente y /admin sin loguearse.
//   - httpClient.js deja de llamar a fetch() y devuelve datos mock (ver
//     services/mockData.js) con la misma forma que la API real, para que
//     las pantallas se vean pobladas.
//   - el formulario de login también queda "mockeado": cualquier
//     email/contraseña funciona y te loguea con el rol de PREVIEW_ROL.
//
// ⚠️ SOLO PARA DESARROLLO LOCAL — con PREVIEW_MODE en true la app NUNCA
// pega al backend real, ni siquiera para loguearse. Volver esta
// constante a `false` antes de conectar con el backend real y antes de
// cualquier entrega.
export const PREVIEW_MODE = false;

// Rol con el que "loguea" el formulario de login cuando PREVIEW_MODE
// está en true. No afecta la navegación directa por URL a /asistente o
// /admin: ahí el guard usa el rol que la propia página requiere, así
// que se pueden ver las pantallas de los dos roles en la misma sesión
// sin tocar esta constante.
export const PREVIEW_ROL = 'ADMINISTRADOR';
