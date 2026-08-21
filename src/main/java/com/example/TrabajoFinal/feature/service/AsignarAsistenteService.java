package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.config.exceptions.BadRequestException;
import com.example.TrabajoFinal.config.exceptions.ResourceNotFoundException;
import com.example.TrabajoFinal.feature.dtos.AsistenteResponse;
import com.example.TrabajoFinal.feature.models.Curso;
import com.example.TrabajoFinal.feature.models.Rol;
import com.example.TrabajoFinal.feature.models.Usuario;
import com.example.TrabajoFinal.repository.CursoRepository;
import com.example.TrabajoFinal.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AsignarAsistenteService implements IAsignarAsistenteService{

    private final CursoRepository cursoRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public void asignarAsistenet(Long idUsuario, Long idCurso) {

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(()-> new ResourceNotFoundException("El usuario no fue encontrado"));

        if (usuario.getRol() != Rol.ASISTENTE) throw new BadRequestException("Debe seleccionar a un asistente, el usuario que ingreso no lo es.");

        Curso curso = cursoRepository.findByIdAndActivoTrue(idCurso)
                .orElseThrow(()-> new ResourceNotFoundException("El curso no fue encontrado"));

        usuario.getCursosAsignados().add(curso);
        usuarioRepository.save(usuario);
    }

    @Override
    @Transactional
    public void quitarAsistente(Long idUsuario, Long idCurso) {

        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(()-> new ResourceNotFoundException("El usuario no fue encontrado"));

        usuario.getCursosAsignados().removeIf((c) -> c.getId().equals(idCurso));
        usuarioRepository.save(usuario);
    }

    /**
     * Lista todos los Asistentes activos junto con los cursos que tienen
     * asignados, para la pantalla de administracion de asistentes.
     */
    @Override
    @Transactional
    public List<AsistenteResponse> listarAsistentes() {

        return usuarioRepository.findByRolAndActivoTrue(Rol.ASISTENTE).stream()
                .map(usuario -> new AsistenteResponse(
                        usuario.getId(),
                        usuario.getNombre(),
                        usuario.getApellido(),
                        usuario.getEmail(),
                        usuario.getCursosAsignados().stream()
                                .filter(Curso::isActivo)
                                .sorted(Comparator.comparing(Curso::getNombre))
                                .map(curso -> new AsistenteResponse.CursoResumen(curso.getId(), curso.getNombre()))
                                .toList()
                ))
                .toList();
    }
}
