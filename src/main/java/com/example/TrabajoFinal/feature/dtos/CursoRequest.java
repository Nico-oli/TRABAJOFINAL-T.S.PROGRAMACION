package com.example.TrabajoFinal.feature.dtos;

import jakarta.validation.constraints.*;

public record CursoRequest(
        @NotBlank(message = "El nombre del curso debe ser completado")
        @Pattern(
                regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ ]+$",
                message = "El nombre unicamente puede contener letras")
        String nombre,
        @NotNull(message = "El año Lectivo debe ser completado")
        @Positive(message = "El año Lectivo deben ser numeros positivos")
        @Max(value = 7,message = "El maximo nivel de Año Lectivo es 7")
        Integer anioLectivo,
        String turno
) {
}
