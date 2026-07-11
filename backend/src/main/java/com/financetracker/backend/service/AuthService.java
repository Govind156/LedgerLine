package com.financetracker.backend.service;

import com.financetracker.backend.dto.AuthResponse;
import com.financetracker.backend.dto.LoginRequest;
import com.financetracker.backend.dto.SignupRequest;
import com.financetracker.backend.entity.User;
import com.financetracker.backend.exception.BadCredentialsCustomException;
import com.financetracker.backend.exception.DuplicateResourceException;
import com.financetracker.backend.repository.UserRepository;
import com.financetracker.backend.security.JwtUtil;
import com.financetracker.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CategoryService categoryService;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An account with this email already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        User saved = userRepository.save(user);

        // Give every new user a starter set of categories so the app is usable immediately.
        categoryService.createDefaultCategoriesForUser(saved);

        String token = jwtUtil.generateToken(new UserPrincipal(saved), saved.getId());

        return AuthResponse.builder()
                .token(token)
                .userId(saved.getId())
                .fullName(saved.getFullName())
                .email(saved.getEmail())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new BadCredentialsCustomException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsCustomException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(new UserPrincipal(user), user.getId());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }
}