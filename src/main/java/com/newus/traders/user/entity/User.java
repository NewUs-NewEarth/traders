package com.newus.traders.user.entity;

import lombok.*;

import javax.persistence.*;

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
    @GeneratedValue(strategy = GenerationType.AUTO)
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

    @Column(name = "point")
    private int point;

    // @ManyToMany
    // @JoinTable(
    // name = "user_authority",
    // joinColumns = {@JoinColumn(name = "user_id", referencedColumnName =
    // "user_id")},
    // inverseJoinColumns = {@JoinColumn(name = "authority_name",
    // referencedColumnName = "authority_name")})
    // private Set<Authority> authorities;
}