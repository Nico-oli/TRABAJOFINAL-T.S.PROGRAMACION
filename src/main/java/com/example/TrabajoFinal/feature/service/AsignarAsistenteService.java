package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.config.exceptions.BadRequestException;
import com.example.TrabajoFinal.config.exceptions.ResourceNotFoundException;
import com.example.TrabajoFinal.feature.models.Curso;
import com.example.TrabajoFinal.feature.models.Rol;
import com.example.TrabajoFinal.feature.models.Usuario;
import com.example.TrabajoFinal.repository.CursoRepository;
import com.example.TrabajoFinal.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
}
