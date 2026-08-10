package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.config.exceptions.ResourceNotFoundException;
import com.example.TrabajoFinal.feature.Mappers.AlumnoMapper;
import com.example.TrabajoFinal.feature.Mappers.AsistenciaMapper;
import com.example.TrabajoFinal.feature.dtos.AlumnoResponse;
import com.example.TrabajoFinal.feature.dtos.AsistenciaResponse;
import com.example.TrabajoFinal.feature.models.Alumno;
import com.example.TrabajoFinal.feature.models.Asistencia;
import com.example.TrabajoFinal.feature.models.EstadoAsistencia;
import com.example.TrabajoFinal.repository.AlumnoRepository;
import com.example.TrabajoFinal.repository.AsistenciaRepository;
import com.example.TrabajoFinal.repository.CursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AlumnoGetService implements IAlumnoGetService {

    private final AlumnoRepository alumnoRepository;
    private final CursoRepository cursoRepository;
    private final AsistenciaRepository asistenciaRepository;

    /**
     * Lista los alumnos activos de un curso. Para cada uno solo se informa
     * el conteo de inasistencias (no el detalle), y ese conteo se calcula
     * con una única consulta agregada para todo el curso, en vez de una
     * consulta por alumno, para que la escalabilidad no dependa de la
     * cantidad de alumnos del curso.
     */
    @Override
    @Transactional(readOnly = true)
    public List<AlumnoResponse> getAlumnoPorCurso(Long idCurso) {

        cursoRepository.findByIdAndActivoTrue(idCurso)
                .orElseThrow(() -> new ResourceNotFoundException("El curso no fue encontrado"));

        List<Alumno> alumnos = alumnoRepository.findByCursoIdAndActivoTrue(idCurso);

        Map<Long, Integer> inasistenciasPorAlumno = new HashMap<>();
        asistenciaRepository.countAusenciasPorCurso(idCurso)
                .forEach(fila -> inasistenciasPorAlumno.put(fila.getAlumnoId(), fila.getCantidad().intValue()));

        return alumnos.stream()
                .map(alumno -> AlumnoMapper.toResponse(
                        alumno,
                        inasistenciasPorAlumno.getOrDefault(alumno.getId(), 0)
                ))
                .toList();
    }

    /**
     * Trae un alumno puntual junto con el detalle completo de sus asistencias
     * (a diferencia del listado por curso, que solo devuelve el conteo).
     */
    @Override
    @Transactional(readOnly = true)
    public AlumnoResponse getAlumno(Long idAlumno) {

        Alumno alumno = alumnoRepository.findByIdAndActivoTrue(idAlumno)
                .orElseThrow(() -> new ResourceNotFoundException("El alumno no fue encontrado"));

        int inAsistencias = (int) asistenciaRepository.countByAlumnoIdAndEstado(idAlumno, EstadoAsistencia.AUSENTE);

        List<Asistencia> asistencias = asistenciaRepository.findByAlumnoIdOrderByFechaDesc(idAlumno);

        // Versión sin el detalle de asistencias, para no duplicarla dentro
        // de cada AsistenciaResponse anidado (evita recursión/payload inflado).
        AlumnoResponse alumnoSinDetalle = AlumnoMapper.toResponse(alumno, inAsistencias);

        List<AsistenciaResponse> asistenciasResponse = asistencias.stream()
                .map(asistencia -> AsistenciaMapper.toResponse(asistencia, alumnoSinDetalle))
                .toList();

        return AlumnoMapper.toResponse(alumno, inAsistencias, asistenciasResponse);
    }
}
