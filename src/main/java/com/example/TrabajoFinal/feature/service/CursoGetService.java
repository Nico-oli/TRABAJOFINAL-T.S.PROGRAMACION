package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.config.exceptions.ResourceNotFoundException;
import com.example.TrabajoFinal.feature.Mappers.CursoMapper;
import com.example.TrabajoFinal.feature.dtos.CursoResponse;
import com.example.TrabajoFinal.feature.models.Curso;
import com.example.TrabajoFinal.feature.models.Rol;
import com.example.TrabajoFinal.feature.models.Usuario;
import com.example.TrabajoFinal.repository.CursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CursoGetService implements ICursoGetService{

    private final CursoRepository cursoRepository;

    @Override
    public List<CursoResponse> getAll(Usuario usuario) {

        if (usuario.getRol().equals(Rol.ADMINISTRADOR)){

            List<Curso> cursos = cursoRepository.findByActivoTrue()
                    .orElseThrow(()-> new ResourceNotFoundException("No hay cursos activos aun."));

            return cursos.stream().map(CursoMapper::toResponse).toList();
        }

        return usuario.getCursosAsignados().stream()
                .filter(Curso::isActivo)
                .map(CursoMapper::toResponse)
                .toList();
    }

    @Override
    public CursoResponse getCursoPorId(Long idCurso) {

        Curso curso = cursoRepository.findByIdAndActivoTrue(idCurso)
                .orElseThrow(()-> new ResourceNotFoundException("El curso no fue encontrado"));

        return CursoMapper.toResponse(curso);
    }
}
