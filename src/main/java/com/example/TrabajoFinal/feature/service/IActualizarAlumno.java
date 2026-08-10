package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.feature.dtos.AlumnoActualizarRequest;
import com.example.TrabajoFinal.feature.dtos.AlumnoResponse;

public interface IActualizarAlumno {
    AlumnoResponse actualizarAlumno(Long idAlumno, AlumnoActualizarRequest actualizarDto);
}
