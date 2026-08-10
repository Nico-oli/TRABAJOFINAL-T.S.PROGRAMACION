package com.example.TrabajoFinal.feature.service;

public interface IAsignarAsistenteService {
    void asignarAsistenet(Long idUsuario, Long idCurso);
    void quitarAsistente(Long idUsuario, Long idCurso);
}
