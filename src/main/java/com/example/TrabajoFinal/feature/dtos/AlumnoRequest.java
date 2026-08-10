package com.example.TrabajoFinal.feature.dtos;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record AlumnoRequest(
        @NotNull(message = "El DNI debe ser completado.")
        @Positive(message = "El DNI no puede ser un numero negativo")
        Long dni,
        @NotBlank(message = "El nombre debe ser completado")
        @Pattern(
                regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$",
                message = "El nombre unicamente puede contener letras")
        @Size(max = 50, message = "El nombre debe tener menos de 50 caracteres")
        String nombre,
        @NotBlank(message = "El apellido debe ser completado")
        @Pattern(
                regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$",
                message = "El apellido unicamente puede contener letras")
        @Size(max = 50, message = "El apellido debe tener menos de 50 caracteres")
        String apellido,
        @NotNull(message = "La fecha de nacimiento debe ser completada")
        @Past(message = "La fecha debe ser anterior a la fecha actual")
        LocalDate fechaDeNacimiento,
        @NotNull(message = "El curso debe ser completado")
        @Positive(message = "El id del curso no puede ser menor a 1")
        Long idCurso
) {
}

