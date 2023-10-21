package com.newus.traders.user.dto;

import com.newus.traders.user.entity.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDTO {
  private String username;
  private String email;

  public static UserResponseDTO of(User user) {
    return new UserResponseDTO(user.getUsername(), user.getEmail());
  }
}