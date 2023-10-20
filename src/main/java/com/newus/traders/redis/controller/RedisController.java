// /**
//  * @author wheesunglee
//  * @create date 2023-10-04 16:10:23
//  * @modify date 2023-10-04 16:10:23
//  */
package com.newus.traders.redis.controller;

import java.time.LocalDate;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.newus.traders.redis.service.RedisService;
import com.newus.traders.user.jwt.TokenProvider;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class RedisController {

    private final RedisService redisService;
    private final TokenProvider tokenProvider;

    public String getUserDetails(String accessToken) {
        Authentication authentication = tokenProvider.getAuthentication(accessToken);
        Object principal = authentication.getPrincipal();
        UserDetails userDetails = (UserDetails) principal;
        return userDetails.getUsername();
    }

    @GetMapping("/redis/attendance")
    public boolean checkAttendance(@RequestHeader("token") String accessToken) {

        return redisService.checkAttendance(LocalDate.now(), getUserDetails(accessToken));
    }

    @PostMapping("/redis/attendance")
    public void updateAttendance(@RequestHeader("token") String accessToken) {

        redisService.updateAttendance(LocalDate.now(), getUserDetails(accessToken));
    }

    @GetMapping("/redis/likes")
    public void getLikes() {

        Long counts = (Long) redisService.countLikes(1L);
        redisService.updateLikesInDB();
        ///////////
    }

    @GetMapping("/redis/checkLiked/{id}")
    public boolean checkIfLiked(@RequestHeader("token") String accessToken, @PathVariable("id") Long productId) {
        System.out.println("좋아요????????" + redisService.checkIfLiked(productId, getUserDetails(accessToken)));
        ;
        return redisService.checkIfLiked(productId, getUserDetails(accessToken));
    }

    @PutMapping("/redis/changeLikes/{id}")
    public void changeLikes(@RequestHeader("token") String accessToken, @PathVariable("id") Long productId) {

        if (redisService.checkIfLiked(productId, getUserDetails(accessToken))) {

            redisService.removeLikes(productId, getUserDetails(accessToken));
        } else {
            redisService.addLikes(productId, getUserDetails(accessToken));

        }
    }

}
