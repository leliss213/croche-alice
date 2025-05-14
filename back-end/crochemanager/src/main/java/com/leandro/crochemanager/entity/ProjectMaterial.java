package com.leandro.crochemanager.entity;

import jakarta.persistence.*;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMaterial extends BaseEntity{

    @Column(name = "quantity_used", nullable = false)
    private Double quantityUsed;

    @Column(name = "average_unit_cost", nullable = false)
    private Double averageUnitCost;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "material_id")
    private Material material;
}
