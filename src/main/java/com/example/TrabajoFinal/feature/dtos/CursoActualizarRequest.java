package com.example.TrabajoFinal.feature.dtos;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

public record CursoActualizarRequest(

        @Pattern(
                regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9 ]+$",
                message = "El nombre unicamente puede contener letras o numeros")
        String nombre,
        @Positive(message = "El año lectivo no puede ser menor a 1")
        Integer anioLectivo,
        @Pattern(
                regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$",
                message = "El turno unicamente puede contener letras")
        String turno

) {
}
