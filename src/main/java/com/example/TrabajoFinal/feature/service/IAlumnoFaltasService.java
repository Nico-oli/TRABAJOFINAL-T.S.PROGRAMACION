package com.example.TrabajoFinal.feature.service;

public interface IAlumnoFaltasService {

    void registrarFalta(Long idAlumno);
    boolean estaProximoALimite(Long idAlumno);
}
