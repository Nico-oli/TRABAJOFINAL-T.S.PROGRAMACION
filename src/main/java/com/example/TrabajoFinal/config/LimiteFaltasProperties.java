package com.example.TrabajoFinal.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Fuente única de los umbrales base de faltas (application.properties).
 * Cualquier service que arme un AlumnoResponse la inyecta para calcular el
 * límite/aviso EFECTIVO del alumno (base + faltasAdicionalesOtorgadas) sin
 * duplicar los mismos dos @Value en cada clase.
 */
@Getter
@Component
public class LimiteFaltasProperties {

    @Value("${app.alumno.limite-faltas}")
    private int limiteFaltas;

    @Value("${app.alumno.faltas-aviso}")
    private int faltasAviso;
}
