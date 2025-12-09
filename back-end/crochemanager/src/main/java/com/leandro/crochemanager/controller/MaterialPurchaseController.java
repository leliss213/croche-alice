package com.leandro.crochemanager.controller;

import com.leandro.crochemanager.entity.MaterialPurchase;
import com.leandro.crochemanager.service.MaterialPurchaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/purchases")
@CrossOrigin(origins = "*")
public class MaterialPurchaseController {

    @Autowired
    private MaterialPurchaseService service;

    @PostMapping
    public ResponseEntity<MaterialPurchase> createPurchase(@RequestBody MaterialPurchase purchase) {
        try {
            MaterialPurchase saved = service.save(purchase);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public List<MaterialPurchase> getAllPurchases() {
        return service.findAll();
    }
}
