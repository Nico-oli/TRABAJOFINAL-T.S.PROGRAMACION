package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.feature.dtos.AlumnoResponse;

import java.util.List;

public interface IAlumnoGetService {
    List<AlumnoResponse> getAlumnoPorCurso(Long idCurso);
    AlumnoResponse getAlumno(Long idAlumno);
}
