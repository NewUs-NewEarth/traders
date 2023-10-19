/**
 * @author wheesunglee
 * @create date 2023-09-23 18:36:56
 * @modify date 2023-09-23 18:36:56
 */

package com.newus.traders.exception;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    PRODUCT_NOT_FOUND(HttpStatus.INTERNAL_SERVER_ERROR, "해당하는 물품을 찾을 수 없습니다."),
    PRODUCT_NOT_SAVED(HttpStatus.BAD_REQUEST, "물품을 저장할 수 없습니다"),
    PRODUCT_NOT_DELETED(HttpStatus.BAD_REQUEST, "물품을 삭제할 수 없습니다"),
    IMAGE_NOT_DELETED(HttpStatus.BAD_REQUEST, "사진을 삭제할 수 없습니다"),
    PRODUCT_NOT_UPDATED(HttpStatus.BAD_REQUEST, "물품을 수정할 수 없습니다"),
    USER_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 존재하는 닉네임 입니다."),
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 가입된 이메일 입니다."),
    USER_NOT_FOUND(HttpStatus.INTERNAL_SERVER_ERROR, "존재하지 않는 회원입니다.");

    private final HttpStatus httpStatus;
    private final String message;
}
