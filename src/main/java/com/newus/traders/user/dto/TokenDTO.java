/**
 * @author heera youn
 * @create date 2023-10-16 10:54:45
 * @modify date 2023-10-16 10:54:45
 */

/**
 * @author wheesunglee
 * @create date 2023-10-21 01:19:05
 * @modify date 2023-10-21 01:19:05
 */
package com.newus.traders.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenDTO {
    private String grantType;
    private String accessToken;
    private String refreshToken;
    private Long accessTokenExpiresIn;
    private Long refreshTokenExpiresIn;
}