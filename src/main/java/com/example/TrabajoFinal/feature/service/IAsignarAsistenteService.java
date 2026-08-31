package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.feature.dtos.AsistenteResponse;

import java.util.List;

public interface IAsignarAsistenteService {
    void asignarAsistenet(Long idUsuario, Long idCurso);
    void quitarAsistente(Long idUsuario, Long idCurso);
    List<AsistenteResponse> listarAsistentes();
}
