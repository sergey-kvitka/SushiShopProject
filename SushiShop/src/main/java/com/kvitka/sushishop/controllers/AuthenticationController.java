package com.kvitka.sushishop.controllers;

import com.kvitka.sushishop.security.dto.AuthenticationRequestDto;
import com.kvitka.sushishop.security.dto.RegistrationRequestDto;
import com.kvitka.sushishop.security.dto.UserDto;
import com.kvitka.sushishop.security.entities.Role;
import com.kvitka.sushishop.security.entities.User;
import com.kvitka.sushishop.security.jwt.JwtTokenProvider;
import com.kvitka.sushishop.security.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth/")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    public AuthenticationController(AuthenticationManager authenticationManager,
                                    JwtTokenProvider tokenProvider,
                                    UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = tokenProvider;
        this.userService = userService;
    }

    @PostMapping("login")
    public Map<Object, Object> login(@RequestBody AuthenticationRequestDto requestDto) {
        try {
            String username = requestDto.getUsername();
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, requestDto.getPassword()));
            User user = userService.findByUsername(username);
            if (user == null) throw new UsernameNotFoundException("");
            String token = jwtTokenProvider.createToken(username, user.getRoles());
            Map<Object, Object> response = new HashMap<>();
            response.put("username", username);
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("token", token);
            response.put("userId", user.getId());
            return response;
        } catch (AuthenticationException e) {
            return new HashMap<>();
//            throw new BadCredentialsException("Invalid username or password");
        }
    }

    @PostMapping("register")
    public Map<Object, Object> register(@RequestBody RegistrationRequestDto requestDto) {
        String username = requestDto.getUsername();
        if (userService.existsByUsername(username)) {
            return new HashMap<>();
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(requestDto.getPassword());
        user.setFirstName(requestDto.getFirstName());
        user.setLastName(requestDto.getLastName());
        userService.register(user);
        AuthenticationRequestDto authenticationRequestDto =
                new AuthenticationRequestDto(username, requestDto.getPassword());
        return login(authenticationRequestDto);
    }

    @GetMapping("activeRoles")
    public List<String> getActiveRoles(@RequestHeader("Authorization") String header) {
        String token = jwtTokenProvider.getToken(header);
        if (token == null || !jwtTokenProvider.validateToken(token)) return new ArrayList<>();
        User user = userService.findByUsername(jwtTokenProvider.getUsername(token));
        if (user == null) return new ArrayList<>();
        return user.getRoles().stream().map(Role::getName).collect(Collectors.toList());
    }

    @GetMapping("users/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable(name = "id") Long id) {
        User user = userService.findById(id);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(UserDto.fromUser(user), HttpStatus.OK);
    }
}
