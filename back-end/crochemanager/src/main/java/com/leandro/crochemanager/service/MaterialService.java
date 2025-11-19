package com.leandro.crochemanager.service;

import com.leandro.crochemanager.entity.Material;
import com.leandro.crochemanager.repository.MaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    public List<Material> findAll() {
        return materialRepository.findAll();
    }

    public Optional<Material> findById(Long id) {
        return materialRepository.findById(id);
    }

    public Material save(Material material) {
        return materialRepository.save(material);
    }

    public void deleteById(Long id) {
        materialRepository.deleteById(id);
    }
    
    public Material update(Long id, Material material) {
        return materialRepository.findById(id)
                .map(existingMaterial -> {
                    existingMaterial.setName(material.getName());
                    existingMaterial.setColor(material.getColor());
                    existingMaterial.setBrand(material.getBrand());
                    existingMaterial.setType(material.getType());
                    existingMaterial.setUnit(material.getUnit());
                    return materialRepository.save(existingMaterial);
                })
                .orElse(null);
    }
}
