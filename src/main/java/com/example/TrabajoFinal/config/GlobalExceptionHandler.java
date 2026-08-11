package com.example.TrabajoFinal.config;

import java.util.List;

import com.example.TrabajoFinal.config.exceptions.CustomException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(CustomException.class)
    public ProblemDetail handleCustomException(CustomException ex) {
        log.warn("{}: {}", ex.getClass().getSimpleName(), ex.getMessage());

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(ex.getStatus(), ex.getMessage());
        problem.setTitle(ex.getStatus().getReasonPhrase());

        if (!ex.getErrors().isEmpty()) {
            problem.setProperty("errors", ex.getErrors());
        }

        return problem;
    }

    /**
     * Maneja las excepciones de validación.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getField() + ": " + f.getDefaultMessage())
                .toList();

        log.warn("Error de validación: {}", errors);

        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problem.setTitle("Error de validación");
        problem.setDetail("Revise los campos indicados.");
        problem.setProperty("errors", errors);

        return problem;
    }

    /**
     * Maneja cualquier excepción no prevista. Se loguea completa (con stack trace)
     * en ERROR para poder diagnosticar el problema real; al cliente solo se le
     * devuelve un mensaje genérico, sin detalles internos.
     */
    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGeneric(Exception ex) {
        log.error("Error inesperado no controlado", ex);

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Ocurrió un error inesperado");
        problem.setTitle("Error interno del servidor");
        problem.setProperty("errors", List.of("Contacte al administrador"));
        return problem;
    }
}
