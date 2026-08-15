import { http } from './httpClient.js';

// TODO: el mockup no tiene ninguna pantalla para disparar el cambio de
// año lectivo. Este service queda listo para cuando se agregue esa
// acción al diseño (probablemente en el perfil de Administrador).
export const anualService = {
  // POST /api/cambiarAnio
  cambiarAnio() {
    return http.post('/cambiarAnio');
  },
};
