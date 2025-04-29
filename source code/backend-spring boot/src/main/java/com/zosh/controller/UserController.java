package com.zosh.controller;

import com.zosh.domain.USER_ROLE;
import com.zosh.exception.UserException;
import com.zosh.model.User;
import com.zosh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getUserProfileHandler(
            @RequestHeader("Authorization") String jwt) throws UserException{

        System.out.println("/api/users/profile");
        User user=userService.findUserProfileByJwt(jwt);
        return new ResponseEntity<>(user,HttpStatus.ACCEPTED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/create")
    public ResponseEntity<User> createUser(@RequestBody User user) throws UserException {
        // Set role as customer
        user.setRole(USER_ROLE.ROLE_CUSTOMER);
        User createdUser = userService.createUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) throws UserException {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}
