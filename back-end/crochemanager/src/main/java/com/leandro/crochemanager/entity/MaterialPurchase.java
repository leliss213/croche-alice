package com.leandro.crochemanager.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Entity
@Table(name = "material_purchases")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialPurchase extends BaseEntity{

    @Column(name = "quantity", nullable = false)
    private Double quantity;

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @Column(name = "purchase_date", nullable = false)
    private LocalDate purchaseDate;

    @ManyToOne
    @JoinColumn(name = "material_id")
    private Material material;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
