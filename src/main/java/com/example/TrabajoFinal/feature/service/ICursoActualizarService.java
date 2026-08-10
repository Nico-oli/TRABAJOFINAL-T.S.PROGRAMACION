package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.feature.dtos.CursoActualizarRequest;
import com.example.TrabajoFinal.feature.dtos.CursoResponse;

public interface ICursoActualizarService {
    CursoResponse actualizarCurso(Long idCurso, CursoActualizarRequest dto);
}
