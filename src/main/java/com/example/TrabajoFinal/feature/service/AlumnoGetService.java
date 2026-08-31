package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.config.LimiteFaltasProperties;
import com.example.TrabajoFinal.config.exceptions.ResourceNotFoundException;
import com.example.TrabajoFinal.feature.Mappers.AlumnoMapper;
import com.example.TrabajoFinal.feature.Mappers.AsistenciaMapper;
import com.example.TrabajoFinal.feature.dtos.AlumnoResponse;
import com.example.TrabajoFinal.feature.dtos.AsistenciaResponse;
import com.example.TrabajoFinal.feature.models.Alumno;
import com.example.TrabajoFinal.feature.models.Asistencia;
import com.example.TrabajoFinal.repository.AlumnoRepository;
import com.example.TrabajoFinal.repository.AsistenciaRepository;
import com.example.TrabajoFinal.repository.CursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlumnoGetService implements IAlumnoGetService {

    private final AlumnoRepository alumnoRepository;
    private final CursoRepository cursoRepository;
    private final AsistenciaRepository asistenciaRepository;
    private final LimiteFaltasProperties limites;



    /**
     * Este se utiliza cuando no requerimos la informacion concreta de un alumno
     * traemos la informacion necesaria para no exponer datos.
     */
    @Override
    @Transactional(readOnly = true)
    public List<AlumnoResponse> getAlumnoPorCurso(Long idCurso) {

        cursoRepository.findByIdAndActivoTrue(idCurso)
                .orElseThrow(() -> new ResourceNotFoundException("El curso no fue encontrado"));

        List<Alumno> alumnos = alumnoRepository.findByCursoIdAndActivoTrue(idCurso);

        return alumnos.stream()
                .map(alumno -> AlumnoMapper.toResponse(alumno, alumno.getFaltas(), limites))
                .toList();
    }

    /**
     * Trae un alumno puntual junto con el detalle completo de sus asistencias
     * (a diferencia del listado por curso, que solo devuelve un conteo de inAsistencias).
     */
    @Override
    @Transactional(readOnly = true)
    public AlumnoResponse getAlumno(Long idAlumno) {

        Alumno alumno = alumnoRepository.findByIdAndActivoTrue(idAlumno)
                .orElseThrow(() -> new ResourceNotFoundException("El alumno no fue encontrado"));

        List<Asistencia> asistencias = asistenciaRepository.findByAlumnoIdOrderByFechaDesc(idAlumno);

        // Versión sin el detalle de asistencias, para no duplicarla dentro
        // de cada AsistenciaResponse anidada.
        AlumnoResponse alumnoSinDetalle = AlumnoMapper.toResponse(alumno, alumno.getFaltas(), limites);

        List<AsistenciaResponse> asistenciasResponse = asistencias.stream()
                .map(asistencia -> AsistenciaMapper.toResponse(asistencia, alumnoSinDetalle))
                .toList();

        return AlumnoMapper.toResponse(alumno, alumno.getFaltas(), asistenciasResponse, limites);
    }
}
