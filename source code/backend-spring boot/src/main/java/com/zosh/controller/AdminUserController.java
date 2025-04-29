package com.zosh.controller;

import com.zosh.exception.UserException;
import com.zosh.domain.USER_ROLE;
import com.zosh.model.User;
import com.zosh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users/admin")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserService userService;

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Authorization") String jwt) throws UserException {
        User admin = userService.findUserProfileByJwt(jwt);
        if (!admin.getRole().equals(USER_ROLE.ROLE_ADMIN)) {
            throw new UserException("Only admin users can access this endpoint");
        }
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/create")
    public ResponseEntity<User> createUser(@RequestBody User user, @RequestHeader("Authorization") String jwt) throws UserException {
        User admin = userService.findUserProfileByJwt(jwt);
        if (!admin.getRole().equals(USER_ROLE.ROLE_ADMIN)) {
            throw new UserException("Only admin users can access this endpoint");
        }
        User createdUser = userService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id, @RequestHeader("Authorization") String jwt) throws UserException {
        System.out.println("Received delete request for user ID: " + id);
        User admin = userService.findUserProfileByJwt(jwt);
        if (!admin.getRole().equals(USER_ROLE.ROLE_ADMIN)) {
            throw new UserException("Only admin users can access this endpoint");
        }
        userService.deleteUser(id);
        System.out.println("Successfully deleted user with ID: " + id);
        return ResponseEntity.ok().build();
    }
}