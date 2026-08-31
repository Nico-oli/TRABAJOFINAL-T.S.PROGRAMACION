package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.config.exceptions.BadRequestException;
import com.example.TrabajoFinal.config.exceptions.ResourceNotFoundException;
import com.example.TrabajoFinal.feature.Mappers.AlumnoMapper;
import com.example.TrabajoFinal.feature.dtos.AlumnoRequest;
import com.example.TrabajoFinal.feature.models.Alumno;
import com.example.TrabajoFinal.feature.models.Curso;
import com.example.TrabajoFinal.repository.AlumnoRepository;
import com.example.TrabajoFinal.repository.CursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlumnoCreateService implements IAlumnoCreateService{

    private final AlumnoRepository alumnoRepository;
    private final CursoRepository cursoRepository;


    @Override
    public void createAlumno(AlumnoRequest dto){

        if(alumnoRepository.findByDni(dto.dni()).isPresent()) throw new BadRequestException("El alumno ya existe");

        Curso curso = cursoRepository.findByIdAndActivoTrue(dto.idCurso())
                .orElseThrow(() -> new ResourceNotFoundException("El curso no fue encontrado"));

        Alumno alumno = AlumnoMapper.toEntity(dto, curso);

        alumnoRepository.save(alumno);
    }
}
