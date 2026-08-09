package com.example.TrabajoFinal.config.exceptions;

import org.springframework.http.HttpStatus;
import java.util.List;
import lombok.Getter;

/**
 * Excepción base para todos los errores de negocio de la aplicación.
 * Normaliza "errors" para que NUNCA sea null: así ningún consumidor
 * (GlobalExceptionHandler, tests, etc.) necesita hacer null-checks.
 */
@Getter
public abstract class CustomException extends RuntimeException {

    private final HttpStatus status;
    private final List<String> errors;

    protected CustomException(String message, HttpStatus status, List<String> errors) {
        super(message);
        this.status = status;
        this.errors = (errors == null) ? List.of() : List.copyOf(errors);
    }
}
