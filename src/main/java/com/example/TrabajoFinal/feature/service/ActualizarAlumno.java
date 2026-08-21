package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.config.exceptions.ResourceNotFoundException;
import com.example.TrabajoFinal.feature.Mappers.AlumnoMapper;
import com.example.TrabajoFinal.feature.dtos.AlumnoActualizarRequest;
import com.example.TrabajoFinal.feature.dtos.AlumnoResponse;
import com.example.TrabajoFinal.feature.models.Alumno;
import com.example.TrabajoFinal.feature.models.Curso;
import com.example.TrabajoFinal.repository.AlumnoRepository;
import com.example.TrabajoFinal.repository.CursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActualizarAlumno implements IActualizarAlumno{

    private final AlumnoRepository alumnoRepository;
    private final CursoRepository cursoRepository;


    @Override
    public AlumnoResponse actualizarAlumno(Long idAlumno, AlumnoActualizarRequest actualizarDto) {

        Alumno alumno = alumnoRepository.findById(idAlumno)
                .orElseThrow(()-> new ResourceNotFoundException("El alumno no fue encontrado"));

        if(actualizarDto.idCurso() != null){
            Curso curso = cursoRepository.findByIdAndActivoTrue(actualizarDto.idCurso())
                    .orElseThrow(()-> new ResourceNotFoundException("El curso no fue encontrado"));

            alumno.setCurso(curso);
        }

        if(actualizarDto.nombre() != null && !actualizarDto.nombre().isBlank()) alumno.setNombre(actualizarDto.nombre());
        if(actualizarDto.apellido() != null && !actualizarDto.apellido().isBlank()) alumno.setApellido(actualizarDto.apellido());
        if(actualizarDto.faltas() != null) alumno.setFaltas(actualizarDto.faltas());
        if(actualizarDto.adicional() != null) alumno.setAdicional(actualizarDto.adicional());

        Alumno guardado = alumnoRepository.save(alumno);

        return AlumnoMapper.toResponse(guardado, guardado.getFaltas());
    }
}
