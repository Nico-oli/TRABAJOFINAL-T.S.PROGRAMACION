package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.feature.models.Alumno;

public interface IAlumnoFaltasService {

    void registrarFalta(Alumno alumno);
    boolean estaProximoALimite(Long idAlumno);
}
