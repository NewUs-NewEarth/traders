/**
 * @author hyunseul
 * @create date 2023-09-26 17:02:54
 * @modify date 2023-09-26 17:02:54
 */
package com.newus.traders.chat.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.newus.traders.chat.dto.ChatDto;
import com.newus.traders.chat.repository.ChatRepository;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;

    // 채팅방 번호로 채팅 내용 조회
    public Flux<ChatDto> getChatMessageByRoomNum(String roomNum) {
        return chatRepository.mFindByRoomNum(roomNum)
                .subscribeOn(Schedulers.boundedElastic())
                .onErrorResume(error -> {

                    return Flux.empty();
                });
    }

    // 메세지 저장
    public Mono<ChatDto> setMsg(ChatDto chat) {
        chat.setCreatedAt(LocalDateTime.now()); // 메세지 생성 시간
        return chatRepository.save(chat); // Object를 리턴하면 자동으로 JSON 변환 (MessageConverter)
    }

    // 채팅방 목록 조회
    public Flux<String> getChatRoomListByUser(String username ) {

        return chatRepository.findBySenderOrReceiver(username, username)
                .map(ChatDto::getRoomNum)
                .distinct();
    }

    // 모달에서 받아온 채팅 저장
    public Mono<ChatDto> saveChatFromModal(ChatDto chat) {
        chat.setCreatedAt(LocalDateTime.now()); // 메세지 생성 시간
        return chatRepository.save(chat);
    }

}
