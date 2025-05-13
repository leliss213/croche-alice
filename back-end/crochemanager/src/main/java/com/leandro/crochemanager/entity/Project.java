package com.leandro.crochemanager.entity;

import com.leandro.crochemanager.entity.Enum.ProjectStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    private Double totalPrice;
    private Double hoursWorked;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<ProjectMaterial> projectMaterials;
}
