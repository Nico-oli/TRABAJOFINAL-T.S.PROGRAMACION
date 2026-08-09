package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.feature.dtos.AlumnoRequest;
import com.example.TrabajoFinal.feature.dtos.AlumnoResponse;

public interface IAlumnoCreateService {
    AlumnoResponse createAlumno(AlumnoRequest dto);
}
