// Sesión del usuario y estado de navegación entre páginas.
//
// La app es multi-página (cada pantalla es un .html distinto, ver el
// árbol del proyecto), así que lo que en el mockup original era estado
// de un único componente (rol, curso seleccionado, alumno seleccionado)
// acá tiene que sobrevivir a la recarga de página. sessionStorage se
// limpia solo al cerrar la pestaña, que es el comportamiento esperado
// para una sesión de login.

const KEYS = {
  token: 'asistencia.token',
  usuario: 'asistencia.usuario',
  selectedCourseId: 'asistencia.selectedCourseId',
  selectedStudentId: 'asistencia.selectedStudentId',
};

export function setSession({ token, usuario }) {
  sessionStorage.setItem(KEYS.token, token);
  sessionStorage.setItem(KEYS.usuario, JSON.stringify(usuario));
}

export function getToken() {
  return sessionStorage.getItem(KEYS.token);
}

export function getUsuario() {
  const raw = sessionStorage.getItem(KEYS.usuario);
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  return !!getToken() && !!getUsuario();
}

/** 'ADMINISTRADOR' | 'ASISTENTE' | null */
export function getRol() {
  return getUsuario()?.rol ?? null;
}

export function clearSession() {
  sessionStorage.removeItem(KEYS.token);
  sessionStorage.removeItem(KEYS.usuario);
  sessionStorage.removeItem(KEYS.selectedCourseId);
  sessionStorage.removeItem(KEYS.selectedStudentId);
}

// — ids seleccionados: se guardan también en la querystring de cada
//   página (?id=...) para que el link sea navegable/recargable; estas
//   funciones son un respaldo para pantallas que no llevan el id en la URL. —
export function setSelectedCourseId(id) {
  sessionStorage.setItem(KEYS.selectedCourseId, id);
}
export function getSelectedCourseId() {
  return sessionStorage.getItem(KEYS.selectedCourseId);
}
export function setSelectedStudentId(id) {
  sessionStorage.setItem(KEYS.selectedStudentId, id);
}
export function getSelectedStudentId() {
  return sessionStorage.getItem(KEYS.selectedStudentId);
}
