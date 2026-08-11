package com.example.TrabajoFinal.repository;

import com.example.TrabajoFinal.feature.models.Curso;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {
    Optional<Curso> findByIdAndActivoTrue(Long id);
    Optional<Curso> findByNombreAndActivoTrue(String nombre);
    Optional<List<Curso>> findByActivoTrue();

    @Modifying
    @Query("UPDATE Curso c SET c.anioLectivo = c.anioLectivo + 1")
    void aumentarAnioLectivo();
}
