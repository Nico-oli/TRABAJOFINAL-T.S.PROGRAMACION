package com.example.TrabajoFinal.config.security;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Se dispara cuando un usuario autenticado no tiene el rol requerido para el endpoint.
 *
 * El JSON se construye a mano (sin ObjectMapper) porque Spring Boot 4 ya no
 * expone com.fasterxml.jackson.databind.ObjectMapper en el classpath por
 * defecto (usa Jackson 3 / JsonMapper). Como el cuerpo es fijo y no incluye
 * datos ingresados por el usuario, no hace falta un mapper para esto.
 */
@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException
    ) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());

        String json = """
                {"title":"Acceso denegado","status":403,"detail":"No tiene permisos suficientes para acceder a este recurso."}""";

        response.getWriter().write(json);
    }
}
