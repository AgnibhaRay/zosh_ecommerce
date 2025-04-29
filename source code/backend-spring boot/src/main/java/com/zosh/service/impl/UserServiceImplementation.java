package com.zosh.service.impl;


import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import com.zosh.exception.UserException;
import com.zosh.service.UserService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.zosh.config.JwtProvider;
import com.zosh.model.PasswordResetToken;
import com.zosh.model.User;
import com.zosh.repository.PasswordResetTokenRepository;
import com.zosh.repository.UserRepository;

@Service
public class UserServiceImplementation implements UserService {


	private UserRepository userRepository;
	private JwtProvider jwtProvider;
	private PasswordEncoder passwordEncoder;
	private PasswordResetTokenRepository passwordResetTokenRepository;
	private JavaMailSender javaMailSender;
	
	public UserServiceImplementation(
			UserRepository userRepository,
			JwtProvider jwtProvider,
			PasswordEncoder passwordEncoder,
			PasswordResetTokenRepository passwordResetTokenRepository,
			JavaMailSender javaMailSender) {
		
		this.userRepository=userRepository;
		this.jwtProvider=jwtProvider;
		this.passwordEncoder=passwordEncoder;
		this.passwordResetTokenRepository=passwordResetTokenRepository;
		this.javaMailSender=javaMailSender;
		
	}

	@Override
	public User findUserProfileByJwt(String jwt) throws UserException {
		String email=jwtProvider.getEmailFromJwtToken(jwt);
		
		
		User user = userRepository.findByEmail(email);
		
		if(user==null) {
			throw new UserException("user not exist with email "+email);
		}
		return user;
	}



	
	@Override
	public User findUserByEmail(String username) throws UserException {
		
		User user=userRepository.findByEmail(username);
		
		if(user!=null) {
			
			return user;
		}
		
		throw new UserException("user not exist with username "+username);
	}

	@Override
	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	@Override
	public User createUser(User user) throws UserException {
		User existingUser = userRepository.findByEmail(user.getEmail());
		if (existingUser != null) {
			throw new UserException("Email already registered");
		}
		
		// Encode password
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		
		return userRepository.save(user);
	}

	@Override
	public void deleteUser(Long userId) throws UserException {
		User user = findUserById(userId);
		userRepository.delete(user);
	}

	@Override
	public User findUserById(Long userId) throws UserException {
		return userRepository.findById(userId)
			.orElseThrow(() -> new UserException("User not found with id: " + userId));
	}

}
