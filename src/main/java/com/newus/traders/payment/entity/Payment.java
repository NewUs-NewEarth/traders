/**
 * @author ahrayi
 * @create date 2023-10-04 01:23:39
 * @modify date 2023-10-04 01:23:39
 */

package com.newus.traders.payment.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Payment {

    // pk - member의 user_code와 연결?
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long clientInfo;

    // 사용자에게 입력받는 정보
    private String userName;
    private String userInfo;
    private String userGender;
    private String cellCarrier;
    private String userCellNo;
    private String agreeYn;
    private String agreeDtime;
    private String payPassword;

    // 최초인증 후 받아오는 정보
    private String userSeqNo;
    private String userCi;
    @Column(length = 400)
    private String accessToken;
    @Column(length = 400)
    private String refreshToken;
    private LocalDateTime expiresIn;

}
