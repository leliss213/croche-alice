package com.leandro.crochemanager.service;

import com.leandro.crochemanager.entity.Material;
import com.leandro.crochemanager.entity.MaterialPurchase;
import com.leandro.crochemanager.repository.MaterialPurchaseRepository;
import com.leandro.crochemanager.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class MaterialPurchaseService {

    @Autowired
    private MaterialPurchaseRepository repository;

    @Autowired
    private MaterialRepository materialRepository;

    public MaterialPurchase save(MaterialPurchase purchase) {
        if (purchase.getMaterial() != null && purchase.getMaterial().getId() != null) {
            Material material = materialRepository.findById(purchase.getMaterial().getId())
                    .orElseThrow(() -> new RuntimeException("Material not found"));
            purchase.setMaterial(material);
        }
        if (purchase.getPurchaseDate() == null) {
            purchase.setPurchaseDate(LocalDate.now());
        }
        return repository.save(purchase);
    }

    public List<MaterialPurchase> findAll() {
        return repository.findAll();
    }
}
