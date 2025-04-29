package com.zosh.service.impl;

import java.util.List;

import com.zosh.domain.USER_ROLE;
import com.zosh.exception.UserException;
import com.zosh.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.zosh.config.JwtProvider;
import com.zosh.model.Cart;
import com.zosh.model.User;
import com.zosh.repository.CartRepository;
import com.zosh.repository.UserRepository;

@Service
public class UserServiceImplementation implements UserService {

	private final UserRepository userRepository;
	private final JwtProvider jwtProvider;
	private final PasswordEncoder passwordEncoder;
	private final CartRepository cartRepository;
	
	public UserServiceImplementation(
			UserRepository userRepository,
			JwtProvider jwtProvider,
			PasswordEncoder passwordEncoder,
			CartRepository cartRepository) {
		
		this.userRepository = userRepository;
		this.jwtProvider = jwtProvider;
		this.passwordEncoder = passwordEncoder;
		this.cartRepository = cartRepository;
	}

	@Override
	public User findUserProfileByJwt(String jwt) throws UserException {
		String email = jwtProvider.getEmailFromJwtToken(jwt);
		
		User user = userRepository.findByEmail(email);
		
		if(user == null) {
			throw new UserException("user not exist with email " + email);
		}
		return user;
	}
	
	@Override
	public User findUserByEmail(String username) throws UserException {
		User user = userRepository.findByEmail(username);
		
		if(user != null) {
			return user;
		}
		
		throw new UserException("user not exist with username " + username);
	}

	@Override
	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	@Override
	public User createUser(User user) throws UserException {
		User existingUser = userRepository.findByEmail(user.getEmail());
		
		if(existingUser != null) {
			throw new UserException("User already exists with email: " + user.getEmail());
		}
		
		// Set default role as customer if not specified
		if(user.getRole() == null) {
			user.setRole(USER_ROLE.ROLE_CUSTOMER);
		}
		
		// Encode password
		if(user.getPassword() != null) {
			user.setPassword(passwordEncoder.encode(user.getPassword()));
		}
		
		User savedUser = userRepository.save(user);
		
		// Create cart for new user
		Cart cart = new Cart();
		cart.setUser(savedUser);
		cartRepository.save(cart);
		
		return savedUser;
	}

	@Override
	public void deleteUser(Long userId) throws UserException {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserException("User not found with id: " + userId));
		
		userRepository.delete(user);
	}
}
