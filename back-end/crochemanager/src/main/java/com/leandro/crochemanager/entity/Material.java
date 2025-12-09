package com.leandro.crochemanager.entity;

import com.leandro.crochemanager.entity.Enum.MaterialType;
import com.leandro.crochemanager.entity.Enum.UnitType;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Entity
@Table(name = "materials")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Material extends BaseEntity {

    @Column(name = "name")
    private String name;

    @Column(name = "material_type")
    @Enumerated(EnumType.STRING)
    private MaterialType type;

    @Column(name = "color")
    private String color;

    @Column(name = "brand")
    private String brand;

    @Column(name = "unit")
    @Enumerated(EnumType.STRING)
    private UnitType unit;

    @OneToMany(mappedBy = "material", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("material")
    private List<MaterialPurchase> purchases;

    @OneToMany(mappedBy = "material", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties("material")
    private List<ProjectMaterial> projectMaterials;

}
