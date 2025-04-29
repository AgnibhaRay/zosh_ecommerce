package com.zosh.service;

import java.util.List;

import com.zosh.exception.UserException;
import com.zosh.model.User;

public interface UserService {

    public User findUserById(Long userId) throws UserException;
    public User findUserProfileByJwt(String jwt) throws UserException;
    public User findUserByEmail(String email) throws UserException;

    // Admin operations
    public List<User> getAllUsers();
    public User createUser(User user) throws UserException;
    public void deleteUser(Long userId) throws UserException;
}
