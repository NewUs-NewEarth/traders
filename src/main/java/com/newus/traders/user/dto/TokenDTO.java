/**
 * @author heera youn
 * @create date 2023-10-16 10:54:45
 * @modify date 2023-10-16 10:54:45
 */

package com.newus.traders.user.dto;

import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenDTO {
    private String grantType;
    private String accessToken;
    private String refreshToken;
    private Long accessTokenExpiresIn;
}