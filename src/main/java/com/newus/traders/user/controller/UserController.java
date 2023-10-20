package com.newus.traders.user.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.newus.traders.exception.CustomException;
import com.newus.traders.exception.ErrorCode;
import com.newus.traders.user.dto.UserResponseDTO;
import com.newus.traders.user.service.UserService;
import com.newus.traders.user.util.SecurityUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserController {

	@Autowired
	private UserService userService;

	// 로그인한 사용자의 ID통해서 사용자 정보를 조회
	@GetMapping("/auth/me")
	public ResponseEntity<UserResponseDTO> findMemberInfoById() {
		System.out.println("로그인한 사용자의 ID를 이용 사용자 정보 조회??");

		return ResponseEntity.ok(userService.findMemberInfoById(SecurityUtil.getCurrentUserId()));
	}

	// 사용자의 이메일 주소 기반 사용자 정보 조회
	@GetMapping("/auth/{email}")
	public ResponseEntity<UserResponseDTO> findMemberInfoByEmail(@PathVariable String email) {
		System.out.println("오지마세요??");
		return ResponseEntity.ok(userService.findMemberInfoByEmail(email));
	}

	// // public UserController(UserService userService) {
	// // this.userService = userService;
	// // }
	// // private TokenProvider tokenProvider;

	// // Bean으로 작성해도 됨.
	// // private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	// @PostMapping("/auth/signup")
	// public ResponseEntity<UserDTO> signup(
	// @Valid @RequestBody UserDTO userDto
	// ) {
	// return ResponseEntity.ok(userService.signup(userDto));
	// }

	// // @PostMapping("/auth/signin")
	// // public ResponseEntity<?> authenticate(@RequestBody UserDTO userDTO) {
	// // UserEntity user = userService.getByCredentials(
	// // userDTO.getEmail(),
	// // userDTO.getPassword(),
	// // passwordEncoder);

	// // if(user != null) {
	// // // 토큰 생성
	// // final String token = tokenProvider.create(user);

	// // final UserDTO responseUserDTO = UserDTO
	// // .builder()
	// // .email(user.getEmail())
	// // .username(user.getUsername())
	// // .password(user.getPassword())
	// // .id(user.getId())
	// // .token(token)
	// // .build();
	// // System.out.println("responseUserDTO" + responseUserDTO);

	// // return ResponseEntity.ok().body(responseUserDTO);

	// // } else {
	// // ResponseDTO responseDTO = ResponseDTO.builder()
	// // .error("Login failed.")
	// // .build();
	// // return ResponseEntity
	// // .badRequest()
	// // .body(responseDTO);
	// // }
	// // }

	// // //회원정보 조회 API
	// // @GetMapping("/auth/user")
	// // Public ResponseEntity<?> findUser(@RequestHeader("Authorization") String
	// accessToken) {

	// // }
	// // //회원정보 수정 API
	// // @PutMapping("/auth/user")

	@GetMapping("/auth/signup/nameCheck")
	public ResponseEntity<?> checkNicknameDuplication(@RequestParam(value = "username") String username) {

		System.out.println("FE에서 넘어온 이름" + username);

		if (userService.existsByUsername(username)) {
			throw new CustomException(ErrorCode.USER_ALREADY_EXISTS);
		}

		return ResponseEntity.ok(HttpStatus.OK);
	}

	@GetMapping("/auth/signup/emailCheck")
	public ResponseEntity<?> checkEmailDuplication(@RequestParam(value = "email") String email) {

		if (userService.existsByUsername(email)) {
			throw new CustomException(ErrorCode.USER_ALREADY_EXISTS);
		}

		return ResponseEntity.ok(HttpStatus.OK);
	}
}
