/**
 * @author heera youn
 * @create date 2023-10-16 10:47:46
 * @modify date 2023-10-16 10:47:46
 */

package com.newus.traders.user.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.newus.traders.user.dto.TokenDTO;
import com.newus.traders.user.dto.TokenRequestDTO;
import com.newus.traders.user.dto.UserRequestDTO;
import com.newus.traders.user.dto.UserResponseDTO;
import com.newus.traders.user.service.AuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/auth/signup")
    public ResponseEntity<UserResponseDTO> signup(@RequestBody UserRequestDTO userRequestDTO) {
        return ResponseEntity.ok(authService.signup(userRequestDTO));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<TokenDTO> login(@RequestBody UserRequestDTO userRequestDTO) {
        return ResponseEntity.ok(authService.login(userRequestDTO));
    }

    @PostMapping("/auth/reissue")
    public ResponseEntity<TokenDTO> reissue(@RequestBody TokenRequestDTO tokenRequestDTO, HttpServletRequest request) {
        String refreshToken = request.getHeader("Refresh"); // Refresh 헤더 가져오기
        System.out.println("Refresh 헤더 값: " + refreshToken);
        System.out.println("넘어온 AT:" + tokenRequestDTO.getAccessToken());
        System.out.println("넘어온 RT: " + tokenRequestDTO.getRefreshToken());
        return ResponseEntity.ok(authService.reissue(tokenRequestDTO));
    }
}
