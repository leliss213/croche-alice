package com.leandro.crochemanager.entity;

import jakarta.persistence.*;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Entity
@Table(name = "project_materials")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMaterial extends BaseEntity{

    @Column(name = "quantity_used", nullable = false)
    @com.fasterxml.jackson.annotation.JsonProperty("quantity")
    private Double quantityUsed;

    @Column(name = "average_unit_cost")
    private Double averageUnitCost;

    @ManyToOne
    @JoinColumn(name = "project_id")
    @ToString.Exclude
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Project project;

    @ManyToOne
    @JoinColumn(name = "material_id")
    private Material material;
}
