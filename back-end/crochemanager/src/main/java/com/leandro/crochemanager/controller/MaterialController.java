package com.leandro.crochemanager.controller;

import com.leandro.crochemanager.entity.Material;
import com.leandro.crochemanager.service.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/materials")
@CrossOrigin(origins = "*") // Allow frontend access
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @GetMapping
    public List<Material> getAllMaterials() {
        return materialService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Material> getMaterialById(@PathVariable Long id) {
        Optional<Material> material = materialService.findById(id);
        return material.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Material> createMaterial(@RequestBody Material material) {
        Material savedMaterial = materialService.save(material);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedMaterial);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Material> updateMaterial(@PathVariable Long id, @RequestBody Material material) {
        Material updatedMaterial = materialService.update(id, material);
        if (updatedMaterial != null) {
            return ResponseEntity.ok(updatedMaterial);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
        materialService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
