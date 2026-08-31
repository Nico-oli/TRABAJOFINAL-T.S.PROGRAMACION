package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.repository.AlumnoRepository;
import com.example.TrabajoFinal.repository.AsistenciaRepository;
import com.example.TrabajoFinal.repository.CursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CambioAnioService implements ICambioAnioService{

    private final CursoRepository cursoRepository;
    private final AsistenciaRepository asistenciaRepository;
    private final AlumnoRepository alumnoRepository;

    @Override
    public void cambioAnual() {
        cursoRepository.aumentarAnioLectivo();
        asistenciaRepository.eliminarTodasLasAsistencias();
        alumnoRepository.resetearFaltas();
        alumnoRepository.resetearAdicionales();
        alumnoRepository.resetearFaltasAdicionalesOtorgadas();
    }
}
