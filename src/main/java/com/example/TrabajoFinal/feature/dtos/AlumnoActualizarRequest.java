package com.example.TrabajoFinal.feature.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record AlumnoActualizarRequest(
        @Pattern(
                regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$",
                message = "El nombre o apellido unicamente puede contener letras")
        String nombre,
        @Pattern(
                regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$",
                message = "El nombre o apellido unicamente puede contener letras")
        String apellido,
        @Positive(message = "El id del Curso no puede ser 0 o menor")
        Long idCurso,
        @PositiveOrZero(message = "Las faltas no puden ser menor a 0")
        @Max(value = 15, message = "Las faltas tienen un limite maximo de 15")
        Integer faltas,
        Boolean adicional

) {
}
