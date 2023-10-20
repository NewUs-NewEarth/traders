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
    PRODUCT_NOT_UPDATED(HttpStatus.BAD_REQUEST, "물품을 수정할 수 없습니다"),
    CAMPAIGN_NOT_FOUND(HttpStatus.INTERNAL_SERVER_ERROR, "해당하는 캠페인을 찾을 수 없습니다."),
    CAMPAIGN_NOT_SAVED(HttpStatus.BAD_REQUEST, "캠페인을 등록할 수 없습니다"),
    SNS_NOT_FOUND(HttpStatus.INTERNAL_SERVER_ERROR, "해당하는 SNS를 찾을 수 없습니다."),
    SNS_NOT_SAVED(HttpStatus.BAD_REQUEST, "SNS를 등록할 수 없습니다"),
    SNS_NOT_DELETED(HttpStatus.BAD_REQUEST, "SNS를 삭제할 수 없습니다"),
    SNS_NOT_UPDATED(HttpStatus.BAD_REQUEST, "SNS를 수정할 수 없습니다"),
    USER_NOT_FOUND(HttpStatus.INTERNAL_SERVER_ERROR, "해당하는 USER를 찾을 수 없습니다."),;

    private final HttpStatus httpStatus;
    private final String message;
}
