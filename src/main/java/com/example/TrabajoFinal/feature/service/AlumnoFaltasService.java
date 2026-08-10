package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.config.exceptions.ResourceNotFoundException;
import com.example.TrabajoFinal.feature.models.Alumno;
import com.example.TrabajoFinal.repository.AlumnoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlumnoFaltasService implements IAlumnoFaltasService {

    private final AlumnoRepository alumnoRepository;

    @Value("${app.alumno.limite-faltas}")
    private int limiteFaltas;

    @Value("${app.alumno.faltas-aviso}")
    private int faltasAviso;

    /**
     * Lo utilizamos para agregar faltas cada que un asistente pone el ausente.
     */
    @Override
    @Transactional
    public void registrarFalta(Long idAlumno) {

        Alumno alumno = alumnoRepository.findByIdAndActivoTrue(idAlumno)
                .orElseThrow(() -> new ResourceNotFoundException("El alumno no fue encontrado"));

        alumno.setFaltas(alumno.getFaltas() + 1);

        // Da la baja logica del alumno cuando llega al limite de faltas
        if (alumno.getFaltas() >= limiteFaltas) {
            alumno.setActivo(false);
            log.info("Alumno {} {} dado de baja por alcanzar el limite de faltas ({})",
                    alumno.getNombre(), alumno.getApellido(), limiteFaltas);
        }

        alumnoRepository.save(alumno);
    }


    /**
     * Lo vamos a utilizar cada que se carguen los alumnos para dar aviso
     * de que llegan al limite de faltas.
     */
    @Override
    @Transactional(readOnly = true)
    public boolean estaProximoALimite(Long idAlumno) {

        Alumno alumno = alumnoRepository.findByIdAndActivoTrue(idAlumno)
                .orElseThrow(() -> new ResourceNotFoundException("El alumno no fue encontrado"));

        return alumno.getFaltas() >= faltasAviso;
    }
}
