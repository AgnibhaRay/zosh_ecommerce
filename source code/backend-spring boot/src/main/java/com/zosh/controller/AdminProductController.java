package com.zosh.controller;

import com.zosh.exception.ProductException;
import com.zosh.model.Product;
import com.zosh.request.CreateProductRequest;
import com.zosh.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products/admin")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.recentlyAddedProduct());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<Product> createProduct(@RequestBody CreateProductRequest request) 
            throws ProductException {
        Product product = productService.createProduct(request, null); // null seller for admin-created products
        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) throws ProductException {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{productId}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long productId,
            @RequestBody Product product) throws ProductException {
        Product updatedProduct = productService.updateProduct(productId, product);
        return ResponseEntity.ok(updatedProduct);
    }
}