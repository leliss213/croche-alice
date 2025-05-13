package com.leandro.crochemanager.entity;

import com.leandro.crochemanager.entity.Enum.MaterialType;
import com.leandro.crochemanager.entity.Enum.UnitType;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "materials")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private MaterialType type;

    private String color;
    private String brand;

    @Enumerated(EnumType.STRING)
    private UnitType unit;

    @OneToMany(mappedBy = "material", cascade = CascadeType.ALL)
    private List<MaterialPurchase> purchases;

    @OneToMany(mappedBy = "material", cascade = CascadeType.ALL)
    private List<ProjectMaterial> projectMaterials;

}
