package com.newus.traders.model.entity;

import java.security.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;

import lombok.AllArgsConstructor;

// import org.hibernate.annotations.CreationTimestamp;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity 
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "member") //(1)
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //(2)
    @Column(name = "user_code") //(3)
    private Long userCode;

    @Column(name = "kakao_id")
    private Long kakaoId;

    @Column(name = "kakao_profile_img")
    private String kakaoProfileImg;

    @Column(name = "kakao_nickname")
    private String kakaoNickname;

    @Column(name = "kakao_email")
    private String kakaoEmail;

    @Column(name = "user_role")
    private String userRole;

    //@Column(name = "create_time")
    //@CreationTimestamp //(4)

    //private Timestamp createTime;

    @Builder
    public User(Long kakaoId, String kakaoProfileImg, String kakaoNickname,
    String kakaoEmail, String userRole) {

        this.kakaoId = kakaoId;
        this.kakaoProfileImg = kakaoProfileImg;
        this.kakaoNickname = kakaoNickname;
        this.kakaoEmail = kakaoEmail;
        this.userRole = userRole;
    }
}

