package com.financetracker.backend.security;

import com.financetracker.backend.entity.User;
import com.financetracker.backend.exception.ResourceNotFoundException;
import com.financetracker.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Resolves the currently authenticated {@link User} entity from the
 * Spring Security context so controllers/services can scope data
 * access to "my own data only".
 */
@Component
@RequiredArgsConstructor
public class CurrentUserProvider {

    private final UserRepository userRepository;

    public UserPrincipal getPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserPrincipal) authentication.getPrincipal();
    }

    public Long getCurrentUserId() {
        return getPrincipal().getId();
    }

    public User getCurrentUser() {
        Long id = getCurrentUserId();
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user no longer exists"));
    }
}