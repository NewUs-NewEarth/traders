package com.newus.traders.user.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "member")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(name = "username", length = 50, unique = true)
    private String username;

    @Column(name = "password", length = 100)
    private String password;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "activated")
    private boolean activated;

    @Column(name = "pictureurl")
    private String pictureurl;

    @Column(name = "local")
    private String local;// 관심지역

    @Enumerated(EnumType.STRING)
    private Authority authority;

    // @ManyToMany
    // @JoinTable(
    // name = "user_authority",
    // joinColumns = {@JoinColumn(name = "user_id", referencedColumnName =
    // "user_id")},
    // inverseJoinColumns = {@JoinColumn(name = "authority_name",
    // referencedColumnName = "authority_name")})
    // private Set<Authority> authorities;
}