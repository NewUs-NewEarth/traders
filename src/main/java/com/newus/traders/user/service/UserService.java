package com.newus.traders.user.service;

import com.newus.traders.exception.CustomException;
import com.newus.traders.exception.ErrorCode;
import com.newus.traders.user.dto.UserResponseDTO;
import com.newus.traders.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;

    public UserResponseDTO findMemberInfoById(Long userId) {
        return userRepository.findById(userId)
                .map(UserResponseDTO::of)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    public UserResponseDTO findMemberInfoByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(UserResponseDTO::of)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // public UserService(UserRepository userRepository, PasswordEncoder
    // passwordEncoder, TokenProvider tokenProvider) {
    // this.userRepository = userRepository;
    // this.passwordEncoder = passwordEncoder;
    // this.tokenProvider = tokenProvider;
    // }

    // @Transactional
    // public UserDTO signup(UserDTO userDto) {
    // if (userRepository.findOneWithAuthoritiesByEmail(userDto.getEmail()).orElse(
    // null) != null) {
    // throw new DuplicateMemberException("이미 가입되어 있는 유저입니다.");
    // }

    // Authority authority = Authority.builder()
    // .authorityName("ROLE_USER")
    // .build();
    // System.out.println("회원가입정보" + userDto);

    // User user = User.builder()
    // .username(userDto.getUsername())
    // .email(userDto.getEmail())
    // .password(passwordEncoder.encode(userDto.getPassword()))
    // .authorities(Collections.singleton(authority))
    // .activated(true)
    // .build();
    // System.out.println("회원가입정보 빌더 : " + user.getUsername());
    // return UserDTO.from(userRepository.save(user));
    // }

    // @Transactional(readOnly = true)
    // public UserDTO getUserWithAuthorities(String username) {
    // return
    // UserDTO.from(userRepository.findOneWithAuthoritiesByEmail(username).orElse(null));
    // }

    // @Transactional(readOnly = true)
    // public UserDTO getMyUserWithAuthorities() {
    // return UserDTO.from(
    // SecurityUtil.getCurrentUsername()
    // .flatMap(userRepository::findOneWithAuthoritiesByEmail)
    // .orElseThrow(() -> new NotFoundMemberException("Member not found"))
    // );
    // }

    // //유저삭제
    // @Transactional
    // public void delete(Long id){
    // User user = this.userRepository.findById(id).orElseThrow(()-> new
    // IllegalArgumentException("해당 유저를 찾을 수 없습니다. user id = " + id ));
    // this.userRepository.delete(user);
    // }

}