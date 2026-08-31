package com.example.TrabajoFinal.feature.service;

import com.example.TrabajoFinal.config.exceptions.BadRequestException;
import com.example.TrabajoFinal.config.exceptions.ResourceNotFoundException;
import com.example.TrabajoFinal.feature.models.Curso;
import com.example.TrabajoFinal.feature.models.Rol;
import com.example.TrabajoFinal.feature.models.Usuario;
import com.example.TrabajoFinal.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioDeleteService implements IUsuarioDeleteService {

    private final UsuarioRepository usuarioRepository;

    /**
     * Baja lógica de un usuario con rol ASISTENTE. Mismo criterio que
     * CursoDeBajaService pero en sentido inverso: un curso no se puede dar
     * de baja mientras tenga asistentes asignados, así que, simétricamente,
     * un asistente no se puede dar de baja mientras tenga cursos asignados
     * — primero hay que desasignarlos (ver AsignarAsistenteService.quitarAsistente).
     */
    @Override
    @Transactional
    public void deleteUsuario(Long idUsuario) {

        Usuario usuario = usuarioRepository.findByIdAndActivoTrue(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (usuario.getRol() != Rol.ASISTENTE) {
            throw new BadRequestException("Solo se puede dar de baja a usuarios con rol ASISTENTE");
        }

        boolean tieneCursosAsignados = usuario.getCursosAsignados().stream().anyMatch(Curso::isActivo);
        if (tieneCursosAsignados) {
            throw new BadRequestException("Debe desasignar todos los cursos del asistente que desea dar de baja");
        }

        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }
}
