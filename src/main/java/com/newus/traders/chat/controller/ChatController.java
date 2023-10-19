/**
 * @author hyunseul
 * @create date 2023-09-26 17:02:48
 * @modify date 2023-09-26 17:02:48
 */
package com.newus.traders.chat.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.newus.traders.chat.dto.ChatDto;
import com.newus.traders.chat.service.ChatService;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

// 채팅 메세지 생성, 조회 및 스트리밍
@SpringBootApplication
@RequiredArgsConstructor
@RestController // 데이터 리턴 서버
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    private final ChatService chatService; // 채팅 메세지 저장, 검색

    @GetMapping(value = "/chat/roomNum/{roomNum}", produces = MediaType.TEXT_EVENT_STREAM_VALUE) // 채팅방 번호와 관련된 채팅 메세지
                                                                                                 // 조회
    public Flux<ChatDto> findByRoomNum(@PathVariable String roomNum) {

        logger.info("Received GET request for roomNum: {}", roomNum);
        return chatService.getChatMessageByRoomNum(roomNum);

    }

    // 채팅 저장
    @PostMapping("/chat")
    public Mono<ResponseEntity<String>> setMsg(@RequestBody ChatDto chat) {
        System.out.println("////////////////////////");
        System.out.println(chat.getSender());
        System.out.println(chat.getReceiver());
        System.out.println(chat.getRoomNum());
        System.out.println("////////////////////////");
        if (chat.getRoomNum() == null || chat.getText() == null || chat.getSender() == null) {
            return Mono.just(ResponseEntity.badRequest().body("Invalid chat message format"));
        }

        logger.info("Received POST request with data: {}", chat);

        chat.setCreatedAt(LocalDateTime.now()); // 메세지 생성 시간
        return chatService.setMsg(chat)
                .map(savedChat -> ResponseEntity.ok("Chat message saved successfully"))
                .defaultIfEmpty(
                        ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save chat message"));
    }

    // 모달데이터 채팅서버 저장
    @PostMapping("/chat/save")
    public Mono<ResponseEntity<String>> saveChatFromModal(@RequestBody ChatDto chat) {
        // 받아온 데이터의 유효성을 검사합니다.
        if (chat.getRoomNum() == null || chat.getText() == null || chat.getSender() == null) {
            return Mono.just(ResponseEntity.badRequest().body("Invalid chat message format"));
        }

        logger.info("Received chat message from modal: {}", chat);

        // 채팅 메시지 저장 로직을 수행합니다.
        chat.setCreatedAt(LocalDateTime.now()); // 메세지 생성 시간
        return chatService.setMsg(chat)
                .map(savedChat -> ResponseEntity.ok("Chat message saved successfully"))
                .defaultIfEmpty(
                        ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save chat message"));
    }

    // @GetMapping(value = "/chat/list") // 채팅방 목록조회
    // public Flux<String> getChatRoomListsBySender(@RequestParam("sender") String
    // sender) {
    // return chatService.getChatRoomListBySender(sender);
    // }

    @GetMapping(value = "/chat/list") // 채팅방 목록조회
    public ResponseEntity<List<String>> getChatRoomListsBySender(@RequestParam("sender") String sender) {
        Flux<String> chatRoomFlux = chatService.getChatRoomListBySender(sender);
        List<String> chatRoomList = chatRoomFlux.collectList().block(); // Flux를 List로 변환

        if (chatRoomList != null) {
            return ResponseEntity.ok(chatRoomList);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
