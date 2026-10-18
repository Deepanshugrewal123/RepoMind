package com.example.demo.service;

import org.springframework.stereotype.Service;
import com.example.demo.repository.UserRepository;
import com.example.demo.model.User;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
