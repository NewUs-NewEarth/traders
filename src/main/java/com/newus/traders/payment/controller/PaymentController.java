/**
 * @author ahrayi
 * @create date 2023-10-10 11:13:25
 * @modify date 2023-10-18 13:42:17
 */

package com.newus.traders.payment.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.newus.traders.payment.dto.DepositResponseDto;
import com.newus.traders.payment.dto.InquiryRcvResponseDto;
import com.newus.traders.payment.dto.MeResponseDto;
import com.newus.traders.payment.dto.PayAccountDto;
import com.newus.traders.payment.dto.PaymentDto;
import com.newus.traders.payment.dto.RegisterResponseDto;
import com.newus.traders.payment.dto.TokenResponseDto;
import com.newus.traders.payment.service.PaymentService;
import com.newus.traders.payment.service.RestTemplateService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class PaymentController {

    private final PaymentService paymentService;
    private final RestTemplateService restTemplateService;

    // 최초등록
    @Transactional
    @PostMapping("/payment/register")
    public ResponseEntity<?> registerData(@RequestBody PaymentDto paymentDto) {

        System.out.println("받은 데이터1: " + paymentDto.toString());
        RegisterResponseDto rr = restTemplateService.authorizeUser(paymentDto);

        System.out.println("받은 데이터2: " + paymentDto.toString());
        System.out.println("받은 데이터3: " + rr.toString());

        TokenResponseDto tr = restTemplateService.getToken(rr.getCode());

        System.out.println("받은 데이터4:" + tr.toString());

        MeResponseDto mr = restTemplateService.getUserInfo(tr.getAccess_token(), tr.getUser_seq_no());
        System.out.println("받은 데이터5: " + mr.toString());

        paymentDto.setAccessToken(tr.getAccess_token());
        paymentDto.setRefreshToken(tr.getRefresh_token());
        paymentDto.setUserSeqNo(tr.getUser_seq_no());
        paymentDto.setExpiresIn(paymentService.getExpirationDate(tr.getExpires_in()));
        paymentDto.setUserCi(mr.getUser_ci());

        paymentService.savePaymentDtoToDb(paymentDto);

        return new ResponseEntity<>(Collections.singletonMap("message", "결제가 성공적으로 등록되었습니다."), HttpStatus.OK);
    }

    // 유효계좌확인
    @Transactional
    @PostMapping(value = "/payment/valid-account")
    public ResponseEntity<?> checkValidAccount(@RequestBody PayAccountDto payAccountDto) {
        System.out.println(payAccountDto.toString());
        InquiryRcvResponseDto irr = restTemplateService.receiveInquiry(payAccountDto, "AU", 1);

        System.out.println(irr.toString());

        if (irr.getRsp_code().equals("A0000") && irr.getBank_rsp_code().equals("000")) {
            int ranNum = restTemplateService.generateRandomNum();
            DepositResponseDto dr = restTemplateService.transferDeposit(payAccountDto, "AU", 1, ranNum);

            if (dr.getRsp_code().equals("A0000") && dr.getRes_list().get(0).getBank_rsp_code().equals("000")) {

                Map<String, Object> responseMap = new HashMap<>();
                responseMap.put("ranNum", ranNum);
                return new ResponseEntity<>(responseMap, HttpStatus.OK);
            }
            return new ResponseEntity<>(Collections.singletonMap("message", "인증 송금 실패"), HttpStatus.BAD_REQUEST);

        }
        return new ResponseEntity<>(Collections.singletonMap("message", "유효하지 않은 계좌입니다."), HttpStatus.BAD_REQUEST);
    }

    // 계좌 등록
    @Transactional
    @PostMapping(value = "/payment/save-account")
    public ResponseEntity<?> savePayAccount(@RequestBody PayAccountDto payAccountDto) {
        System.out.println(payAccountDto.toString());
        paymentService.savePayAccountDtoToDb(payAccountDto);

        // 파일 전송~~~~~~

        return new ResponseEntity<>(Collections.singletonMap("message", "계좌가 성공적으로 등록되었습니다."), HttpStatus.OK);
    }

    // 인증문자 발송
    @Transactional
    @PostMapping(value = "/payment/sms")
    public ResponseEntity<?> sendSms(@RequestBody Map<String, String> requestBody) {
        System.out.println(requestBody.toString());

        String rphone = requestBody.get("rphone");
        System.out.println(rphone);
        try {

            System.out.println(rphone);
            paymentService.sendSms(rphone);
            System.out.println(rphone);

            return new ResponseEntity<>(Collections.singletonMap("message", "문자 발송 성공"), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.singletonMap("message", "문자 발송 실패"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 인증문자 일치 확인
    @Transactional
    @PostMapping(value = "/payment/verify-sms")
    public ResponseEntity<?> verifySms(@RequestBody Map<String, String> requestBody) {
        System.out.println(requestBody.toString());

        try {
            String rphone = requestBody.get("rphone");
            System.out.println("controller: " + rphone);
            String inputAuthNum = requestBody.get("inputAuthNum");
            System.out.println("controller: " + inputAuthNum);

            if (paymentService.verifyAuthNum(rphone, inputAuthNum)) {
                return new ResponseEntity<>(Collections.singletonMap("message", "문자 인증 성공"), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(Collections.singletonMap("message", "문자 인증 실패"),
                        HttpStatus.ALREADY_REPORTED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(Collections.singletonMap("message", "문자 인증 실패"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}