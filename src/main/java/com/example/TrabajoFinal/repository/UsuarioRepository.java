package com.example.TrabajoFinal.repository;

import com.example.TrabajoFinal.feature.models.Usuario;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<Usuario> findByIdAndActivoTrue(Long id);

    List<Usuario> findByCursosAsignados_Id(Long idCurso);
}
