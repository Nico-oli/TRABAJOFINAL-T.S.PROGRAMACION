package com.example.TrabajoFinal.feature.dtos;

import jakarta.validation.constraints.NotNull;

public record ReincorporarRequest(
        @NotNull(message = "Debe indicar la cantidad de faltas adicionales")
        Integer cantidadFaltasAdicionales
) {
}
