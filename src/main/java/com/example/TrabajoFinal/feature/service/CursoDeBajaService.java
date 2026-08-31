package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.config.exceptions.BadRequestException;
import com.example.TrabajoFinal.config.exceptions.ResourceNotFoundException;
import com.example.TrabajoFinal.feature.models.Alumno;
import com.example.TrabajoFinal.feature.models.Curso;
import com.example.TrabajoFinal.repository.AlumnoRepository;
import com.example.TrabajoFinal.repository.CursoRepository;
import com.example.TrabajoFinal.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CursoDeBajaService implements ICursoDeBajaService{

    private final CursoRepository cursoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AlumnoRepository alumnoRepository;

    /**
     * No revisamos si hay alumnos porque se puede utilizar tambien para dar de baja
     * a los cursos en el ultimo año lectivo
     */
    @Override
    public void darDeBaja(Long idCurso) {

        if(!usuarioRepository.findByCursosAsignados_Id(idCurso).isEmpty()) throw new BadRequestException("Debe desasignar todos los asistentes del curso que desea dar de baja");

        Curso curso = cursoRepository.findByIdAndActivoTrue(idCurso)
                .orElseThrow(()-> new ResourceNotFoundException("El curso no fue encontrado"));

        List<Alumno> alumnos = alumnoRepository.findByCursoIdAndActivoTrue(curso.getId());

        alumnos.forEach((a) ->{
                a.setActivo(false);
                }
        );

        curso.setActivo(false);
        curso = cursoRepository.save(curso);
    }
}
