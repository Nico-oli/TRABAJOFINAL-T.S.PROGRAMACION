package com.example.TrabajoFinal.config.security;

import java.io.IOException;

import org.jspecify.annotations.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * Filtro único por request: lee el header "Authorization: Bearer <token>",
 * valida el JWT y, si es válido, autentica al usuario en el SecurityContext.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String HEADER_NAME = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader(HEADER_NAME);

        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(BEARER_PREFIX.length());
        final String userEmail = safeExtractUsername(jwt);

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            authenticateIfValid(request, jwt, userEmail);
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Carga el usuario y, si el token es válido para él, lo autentica en el
     * SecurityContext. Si el usuario del token ya no existe (por ejemplo, fue
     * eliminado luego de emitido el token), simplemente no autentica: la
     * request sigue como anónima y la capa de autorización la rechazará con
     * un 401/403 normal, en vez de propagar una excepción no controlada (500).
     */
    private void authenticateIfValid(HttpServletRequest request, String jwt, String userEmail) {
        UserDetails userDetails;
        try {
            userDetails = userDetailsService.loadUserByUsername(userEmail);
        } catch (UsernameNotFoundException e) {
            return;
        }

        if (jwtService.isTokenValid(jwt, userDetails)) {
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }
    }

    private String safeExtractUsername(String jwt) {
        try {
            return jwtService.extractUsername(jwt);
        } catch (JwtException | IllegalArgumentException e) {
            // Token ausente, mal formado, expirado o con firma inválida: se trata
            // como "no autenticado" y sigue la cadena de filtros sin cortar la request.
            return null;
        }
    }
}
