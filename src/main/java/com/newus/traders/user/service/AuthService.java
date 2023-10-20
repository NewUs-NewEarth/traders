package com.newus.traders.user.service;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newus.traders.user.dto.TokenDTO;
import com.newus.traders.user.dto.TokenRequestDTO;
import com.newus.traders.user.dto.UserRequestDTO;
import com.newus.traders.user.dto.UserResponseDTO;
import com.newus.traders.user.entity.RefreshToken;
import com.newus.traders.user.entity.User;
import com.newus.traders.user.jwt.TokenProvider;
import com.newus.traders.user.repository.RefreshTokenRepository;
import com.newus.traders.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public UserResponseDTO signup(UserRequestDTO userRequestDTO) {
        if (userRepository.existsByEmail(userRequestDTO.getEmail())) {
            throw new RuntimeException("이미 가입되어 있는 유저입니다");
        }

        User user = userRequestDTO.toUser(passwordEncoder);
        return UserResponseDTO.of(userRepository.save(user));
    }

    @Transactional
    public TokenDTO login(UserRequestDTO userRequestDTO) {
        // 1. Login ID/PW 를 기반으로 AuthenticationToken 생성
        UsernamePasswordAuthenticationToken authenticationToken = userRequestDTO.toAuthentication();
        System.out.println("로그인검증 정보" + authenticationToken);

        // 2. 실제로 검증 (사용자 비밀번호 체크) 이 이루어지는 부분
        // authenticate 메서드가 실행이 될 때 CustomUserDetailsService 에서 만들었던 loadUserByUsername
        // 메서드가 실행됨
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // 3. 인증 정보를 기반으로 JWT 토큰 생성
        TokenDTO tokenDTO = tokenProvider.generateTokenDto(authentication);

        // 4. RefreshToken 저장
        RefreshToken refreshToken = RefreshToken.builder()
                .key(authentication.getName())
                .value(tokenDTO.getRefreshToken())
                .build();

        refreshTokenRepository.save(refreshToken);

        // 5. 토큰 발급
        return tokenDTO;
    }

    @Transactional
    // string refreshtoken 받기
    public TokenDTO reissue(TokenRequestDTO tokenRequestDTO) {

        System.out.println("DTO의 RT 값: " + tokenRequestDTO.getRefreshToken());
        // 1. Refresh Token 검증
        if (!tokenProvider.validateToken(tokenRequestDTO.getRefreshToken())) {
            throw new RuntimeException("Refresh Token 이 유효하지 않습니다.");
        }

        // 2. Access Token 에서 Member ID 가져오기
        Authentication authentication = tokenProvider.getAuthentication(tokenRequestDTO.getAccessToken());

        // 3. 저장소에서 Member ID 를 기반으로 Refresh Token 값 가져옴
        RefreshToken refreshToken = refreshTokenRepository.findByKey(authentication.getName())
                .orElseThrow(() -> new RuntimeException("로그아웃 된 사용자입니다."));

        // 4. Refresh Token 일치하는지 검사
        if (!refreshToken.getValue().equals(tokenRequestDTO.getRefreshToken())) {
            throw new RuntimeException("토큰의 유저 정보가 일치하지 않습니다.");
        }

        // String stringRefreshToken = refreshToken.getValue();

        // 5. 새로운 토큰 생성//////////
        // TokenDTO tokenDTO =
        // tokenProvider.reissueAccessToken(authentication,stringRefreshToken);
        TokenDTO tokenDTO = tokenProvider.generateTokenDto(authentication);
        System.out.println("새로 발급받은 RT : " + tokenDTO.getRefreshToken());

        // 6. 저장소 정보 업데이트
        RefreshToken newRefreshToken = refreshToken.updateValue(tokenDTO.getRefreshToken());
        refreshTokenRepository.save(newRefreshToken);

        // 토큰 발급
        System.out.println("TokenDTO의 AT: " + tokenDTO.getAccessToken());
        System.out.println("TokenDTO의 RT: " + tokenDTO.getRefreshToken());
        return tokenDTO;
    }
}
