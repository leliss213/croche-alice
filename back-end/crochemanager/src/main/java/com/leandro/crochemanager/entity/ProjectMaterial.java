package com.leandro.crochemanager.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProjectMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double quantityUsed;
    private Double averageUnitCost;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "material_id")
    private Material material;
}
