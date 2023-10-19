// /**
//  * @author wheesunglee
//  * @create date 2023-10-04 16:10:23
//  * @modify date 2023-10-04 16:10:23
//  */
// package com.newus.traders.redis.controller;

// import java.time.LocalDate;

// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.newus.traders.redis.service.RedisService;

// import lombok.RequiredArgsConstructor;

// @RestController
// @RequiredArgsConstructor
// @RequestMapping("/api")
// public class RedisController {

//     private final RedisService redisService;

//     @GetMapping("/redis/attendance")
//     public boolean checkAttendance() {

//         return redisService.checkAttendance(LocalDate.now(), 3L);
//     }

//     @PostMapping("/redis/attendance")
//     public void updateAttendance() {

//         redisService.updateAttendance(LocalDate.now(), 3L);
//     }

//     @GetMapping("/redis/likes")
//     public void getLikes() {

//         redisService.addLikes(1L, 1L);
//         redisService.addLikes(1L, 2L);
//         redisService.addLikes(1L, 3L);
//         // System.out.println(redisService.checkIfLiked(1L, 3L));
//         // System.out.println(redisService.checkIfLiked(1L, 2L));
//         // System.out.println(redisService.countLikes(1L));
//         // redisService.removeLikes(1L, 2L);

//         Long counts = (Long) redisService.countLikes(1L);
//         System.out.println(counts);
//         redisService.updateLikesInDB();
//     }

//     @PutMapping("/redis/changeLikes/{id}")
//     public void changeLikes(@PathVariable("id") Long id) {
//         System.out.println("사용자 1L: " + redisService.checkIfLiked(id, 1L));

//         if (redisService.checkIfLiked(id, 1L)) {

//             redisService.removeLikes(id, 1L);
//             System.out.println("좋아요 취소");
//         } else {
//             redisService.addLikes(id, 1L);
//             System.out.println("좋아요");

//         }
//         // redisService.updateLikesInDB();
//     }

// }
