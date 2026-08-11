package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.config.exceptions.ResourceNotFoundException;
import com.example.TrabajoFinal.feature.models.Alumno;
import com.example.TrabajoFinal.repository.AlumnoRepository;
import com.example.TrabajoFinal.repository.AsistenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlumnoDeleteService implements IAlumnoDeleteService{

    private final AlumnoRepository alumnoRepository;
    private final AsistenciaRepository asistenciaRepository;

    @Override
    public void deleteAlumno(Long idAlumno) {

        Alumno alumno = alumnoRepository.findByIdAndActivoTrue(idAlumno)
                .orElseThrow(()-> new ResourceNotFoundException("Alumno no encontrado"));

        alumno.setActivo(false);

        alumnoRepository.save(alumno);
        asistenciaRepository.eliminarPorAlumno(alumno.getId());
    }
}
