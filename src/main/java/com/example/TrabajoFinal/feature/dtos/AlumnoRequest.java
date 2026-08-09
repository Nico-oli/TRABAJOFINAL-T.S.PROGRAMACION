package com.example.TrabajoFinal.feature.dtos;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record AlumnoRequest(
        @NotNull(message = "El DNI debe ser completado.")
        @Positive(message = "El DNI no puede ser un numero negativo")
        @Min(value = 7, message = "El DNI debe tener 7 o 8 caracteres")
        @Max(value = 8, message = "El DNI debe tener 7 o 8 caracteres")
        Long dni,
        @NotBlank(message = "El nombre debe ser completado")
        String nombre,
        @NotBlank(message = "El apellido debe ser completado")
        String apellido,
        @NotNull(message = "La fecha de nacimiento debe ser completada")
        @Past(message = "La fecha debe ser anterior a la fecha actual")
        LocalDate fechaDeNacimiento,
        @NotNull(message = "El curso debe ser completado")
        @Positive(message = "El id del curso no puede ser 0 o negativo")
        Long idCurso
) {
}

