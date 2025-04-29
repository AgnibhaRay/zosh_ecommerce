package com.zosh.controller;

import com.zosh.domain.AccountStatus;
import com.zosh.domain.USER_ROLE;
import com.zosh.exception.SellerException;
import com.zosh.model.HomeCategory;
import com.zosh.model.Seller;
import com.zosh.service.HomeCategoryService;
import com.zosh.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final SellerService sellerService;
    private final HomeCategoryService homeCategoryService;

    @PostMapping("/seller/create")
    public ResponseEntity<Seller> createSeller(@RequestBody Seller seller) throws SellerException {
        // Set initial properties
        seller.setRole(USER_ROLE.ROLE_SELLER);
        seller.setAccountStatus(AccountStatus.ACTIVE);  // Admin-created sellers are active by default
        seller.setEmailVerified(true);  // Admin-created sellers are pre-verified

        Seller savedSeller = sellerService.createSeller(seller);
        return new ResponseEntity<>(savedSeller, HttpStatus.CREATED);
    }

    @PatchMapping("/seller/{id}/status/{status}")
    public ResponseEntity<Seller> updateSellerStatus(
            @PathVariable Long id,
            @PathVariable AccountStatus status) throws SellerException {

        Seller updatedSeller = sellerService.updateSellerAccountStatus(id,status);
        return ResponseEntity.ok(updatedSeller);

    }

    @GetMapping("/home-category")
    public ResponseEntity<List<HomeCategory>> getHomeCategory(
          ) throws Exception {

        List<HomeCategory> categories=homeCategoryService.getAllCategories();
        return ResponseEntity.ok(categories);

    }

    @PatchMapping("/home-category/{id}")
    public ResponseEntity<HomeCategory> updateHomeCategory(
            @PathVariable Long id,
            @RequestBody HomeCategory homeCategory) throws Exception {

        HomeCategory updatedCategory=homeCategoryService.updateCategory(homeCategory,id);
        return ResponseEntity.ok(updatedCategory);

    }
}
