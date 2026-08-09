package com.example.TrabajoFinal.feature.models;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Curso de la institución (ej: "5to A - Turno Mañana").
 */
@Entity
@Table(name = "cursos")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false)
    private Integer anioLectivo;

    @Column(length = 30)
    private String turno;

    /**
     * Baja lógica del curso.
     */
    @Builder.Default
    @Column(nullable = false)
    private boolean activo = true;

    /**
     * Lado inverso de la relación Usuario (Asistente) <-> Curso.
     */
    @Builder.Default
    @JsonIgnore
    @ManyToMany(mappedBy = "cursosAsignados")
    private Set<Usuario> asistentes = new HashSet<>();
}
