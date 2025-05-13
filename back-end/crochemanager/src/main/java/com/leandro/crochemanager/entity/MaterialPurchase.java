package com.leandro.crochemanager.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "material_purchases")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MaterialPurchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double quantity;
    private Double totalPrice;
    private LocalDate purchaseDate;

    @ManyToOne
    @JoinColumn(name = "material_id")
    private Material material;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
