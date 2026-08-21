// Capa HTTP compartida por todos los *Service. Centraliza: base URL,
// header de autenticación, parseo del sobre BaseResponse<T> del backend
// ({ data, message, errors, timestamp }) y manejo de errores.
//
// OJO: ese sobre con "message" es sólo para respuestas 2xx. Los errores
// del backend (401/403/404/validación/500) NO usan BaseResponse — usan
// ProblemDetail (RFC 7807) o JSON armado a mano en 401/403, y en ambos
// casos el mensaje humano viaja en "detail", nunca en "message". Los
// errores de validación además traen el detalle por campo en "errors[]"
// (el "detail" en ese caso es genérico: "Revise los campos indicados.").

import { API_BASE_URL } from './apiConfig.js';
import { getToken, clearSession } from '../session.js';
import { PREVIEW_MODE } from '../config.js';
import { resolveMockRequest, MockNotFoundError, MockHttpError } from './mockData.js';

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors || null;
  }
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  // MODO VISTA PREVIA (ver js/config.js): no pega al backend real, resuelve
  // contra los datos mock de services/mockData.js. Recordar volver
  // PREVIEW_MODE a false antes de conectar con el backend / entregar.
  if (PREVIEW_MODE) {
    try {
      return await resolveMockRequest(method, path, body);
    } catch (err) {
      if (err instanceof MockHttpError) throw new ApiError(err.message, err.status, null);
      if (err instanceof MockNotFoundError) throw new ApiError(err.message, 501, null);
      throw err;
    }
  }

  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. Verificá tu conexión.', 0, null);
  }

  if (response.status === 401) {
    // Token ausente/expirado/inválido: no queda otra que volver a loguear.
    clearSession();
  }

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    // "detail" (ProblemDetail) es el mensaje humano en los errores del
    // backend — "message" ahí no existe (ver comentario arriba). Cuando
    // hay "errors[]" (validación) se suman al mensaje: "detail" solo es
    // genérico ("Revise los campos indicados."), el detalle real por
    // campo está en esos items.
    const errors = payload?.errors ?? null;
    const message = errors?.length
      ? [payload?.detail, ...errors].filter(Boolean).join(' — ')
      : payload?.detail || `Error ${response.status}`;
    throw new ApiError(message, response.status, errors);
  }

  return payload?.data;
}

export const http = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
};
