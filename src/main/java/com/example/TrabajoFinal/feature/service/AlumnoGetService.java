package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.config.exceptions.ResourceNotFoundException;
import com.example.TrabajoFinal.feature.Mappers.AlumnoMapper;
import com.example.TrabajoFinal.feature.dtos.AlumnoResponse;
import com.example.TrabajoFinal.feature.models.Alumno;
import com.example.TrabajoFinal.feature.models.Curso;
import com.example.TrabajoFinal.repository.AlumnoRepository;
import com.example.TrabajoFinal.repository.CursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlumnoGetService implements IAlumnoGetService{

    private final AlumnoRepository alumnoRepository;
    private final CursoRepository cursoRepository;


    @Override
    public List<AlumnoResponse> getAlumnoPorCurso(Long idCurso) {

       if(cursoRepository.findByIdAndActivoTrue(idCurso).isEmpty()) throw new ResourceNotFoundException("El curso no fue encontrado");

       List<Alumno> alumnos = alumnoRepository.findByCursoIdAndActivoTrue(idCurso);

        List<AlumnoResponse> responses = alumnos.stream().map((a) -> {AlumnoMapper.toResponse(a, 0)).toList();


        return new ArrayList<>();
    }

    @Override
    public AlumnoResponse getAlumno(Long idAlumno) {
        return null;
    }
}
