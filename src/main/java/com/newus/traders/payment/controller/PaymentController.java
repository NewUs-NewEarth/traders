/**
 * @author ahrayi
 * @create date 2023-10-10 11:13:25
 * @modify date 2023-10-23 16:29:41
 */

package com.newus.traders.payment.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.newus.traders.exception.CustomException;
import com.newus.traders.exception.ErrorCode;
import com.newus.traders.payment.dto.DepositResponseDto;
import com.newus.traders.payment.dto.InquiryRcvResponseDto;
import com.newus.traders.payment.dto.PayAccountDto;
import com.newus.traders.payment.dto.PaymentDto;
import com.newus.traders.payment.dto.RegisterResponseDto;
import com.newus.traders.payment.dto.TokenResponseDto;
import com.newus.traders.payment.dto.TransactionHistoryDto;
import com.newus.traders.payment.dto.TransferDto;
import com.newus.traders.payment.dto.WithdrawRequestDto;
import com.newus.traders.payment.dto.WithdrawResponseDto;
import com.newus.traders.payment.entity.PayAccount;
import com.newus.traders.payment.entity.Payment;
import com.newus.traders.payment.entity.TransactionHistory;
import com.newus.traders.payment.service.PaymentService;
import com.newus.traders.payment.service.RestTemplateService;
import com.newus.traders.product.dto.ProductDto;
import com.newus.traders.product.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class PaymentController {

    private final PaymentService paymentService;
    private final ProductService productService;
    private final RestTemplateService restTemplateService;

    // 회원 등급 판별(0:페이 미가입, 1:계좌 미등록, 2:계좌 등록)
    @GetMapping("/payment/payLanding")
    public ResponseEntity<?> getMemberGrade(@RequestHeader("token") String accessToken) {
        int memberGrade = paymentService.getMemberGrade(accessToken);

        return ResponseEntity.ok(memberGrade);
    }

    // 최초등록
    @Transactional
    @PostMapping("/payment/register")
    public ResponseEntity<?> registerData(@RequestBody PaymentDto paymentDto,
            @RequestHeader("token") String accessToken) {

        // 사용자인증
        RegisterResponseDto rr = restTemplateService.authorizeUser(paymentDto);

        // 토큰 발급
        TokenResponseDto tr = restTemplateService.getToken(rr.getCode());

        // 사용자정보조회
        // MeResponseDto mr = restTemplateService.getUserInfo(tr.getAccess_token(),
        // tr.getUser_seq_no());

        paymentDto.setAccessToken(tr.getAccess_token());
        paymentDto.setRefreshToken(tr.getRefresh_token());
        paymentDto.setUserSeqNo(tr.getUser_seq_no());
        paymentDto.setExpiresIn(paymentService.getExpirationDate(tr.getExpires_in()));
        paymentDto.setUserCi(restTemplateService.getCi(tr.getUser_seq_no()));

        paymentService.savePaymentDtoToDb(paymentDto, accessToken);

        return new ResponseEntity<>(Collections.singletonMap("message", "결제가 성공적으로 등록되었습니다."), HttpStatus.OK);
    }

    // 유효계좌확인
    @Transactional
    @PostMapping(value = "/payment/valid-account")
    public ResponseEntity<?> checkValidAccount(@RequestBody PayAccountDto payAccountDto,
            @RequestHeader("token") String accessToken) {

        Optional<Payment> payment = paymentService.getPaymentInfo(accessToken);
        String userName = payment.get().getUserName();

        payAccountDto.setClientInfo(payment.get().getClientInfo());
        payAccountDto.setUserName(userName);

        // 수취조회
        InquiryRcvResponseDto irr = restTemplateService.receiveInquiry(payAccountDto, "AU", 1);

        if (irr.getRsp_code().equals("A0000") && irr.getBank_rsp_code().equals("000")) {
            int ranNum = restTemplateService.generateRandomNum();
            // 입금(AU)
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
    public ResponseEntity<?> savePayAccount(@RequestBody PayAccountDto payAccountDto,
            @RequestHeader("token") String accessToken) {

        // ClientInfo 추출
        Long clientInfo = paymentService.getClientInfo(accessToken).get();
        Payment payment = paymentService.getPaymentInfo(accessToken).get();

        // 그린페이 가입 상태 확인
        if (!(paymentService.checkPayMember(clientInfo))) {
            // throw new PaymentException(); 그린페이 가입 회원이 아닙니다.
        } else if (paymentService.checkAccntMember(clientInfo)) {
            // 계좌등록여부 확인 -> 이미 등록된 계좌가 있습니다. 확인 -> 계좌정보로 이동.
        }
        payAccountDto.setClientInfo(clientInfo);
        payAccountDto.setUserName(payment.getUserName());

        paymentService.savePayAccountDtoToDb(payAccountDto);

        // 동의자료 파일 전송~~~~~~

        return new ResponseEntity<>(Collections.singletonMap("message", "계좌가 성공적으로 등록되었습니다."), HttpStatus.OK);
    }

    // 인증문자 발송
    @Transactional
    @PostMapping(value = "/payment/sms")
    public ResponseEntity<?> sendSms(@RequestBody Map<String, String> requestBody) {
        String rphone = requestBody.get("rphone");
        try {

            paymentService.sendSms(rphone);

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

        try {
            String rphone = requestBody.get("rphone");
            String inputAuthNum = requestBody.get("inputAuthNum");

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

    // 그린페이 페이지 로드 시 페이정보 응답
    @PostMapping(value = "/payment/payMgmt")
    public ResponseEntity<?> getPayinfo(@RequestHeader("token") String accessToken) {
        // header: nickName
        Long clientInfo = paymentService.getClientInfo(accessToken).get();
        try {
            // response: 계좌번호, 은행번호, 닉네임, 페이잔액
            PayAccount payAccount = paymentService.getPayAccountInfo(clientInfo).get();

            return new ResponseEntity<>(payAccount, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(Collections.singletonMap("message", "등록계좌조회 오류"), HttpStatus.BAD_REQUEST);
        }

    }

    // 그린페이 충전
    @Transactional
    @PostMapping(value = "/payment/add")
    public ResponseEntity<?> addPayMoney(@RequestBody TransferDto transferDto,
            @RequestHeader("token") String accessToken) {
        // header: nickName, body: 충전금액, 페이비밀번호

        // 유저정보 추출
        Long clientInfo = paymentService.getClientInfo(accessToken).get();
        Payment payment = paymentService.getPaymentInfo(accessToken).get();
        PayAccount payAccount = paymentService.getPayAccountInfo(accessToken).get();
        // 페이비밀번호 대조 후 (불일치 시 예외 처리
        if (transferDto.getPayPwd().isEmpty() || !(transferDto.getPayPwd().equals(payment.getPayPassword()))) {
            System.out.println("비번 불일치");
            throw new CustomException(ErrorCode.PASSWORD_NOT_MATCHED);
        }
        // 일치 시 출금 API 호출
        if (transferDto.getPayPwd().equals(payment.getPayPassword())) {

            try {
                WithdrawRequestDto withdrawRequestDto = new WithdrawRequestDto();
                withdrawRequestDto.setDpsPrintContent("충전:" + payment.getClientInfo().toString());
                withdrawRequestDto.setTranAmt(transferDto.getTransferAmt());
                withdrawRequestDto.setWdPrintContent("그린페이충전");
                withdrawRequestDto.setTransferPurpose("RC");

                WithdrawResponseDto withdrawResponseDto = restTemplateService.transferWithdraw(withdrawRequestDto,
                        payment, payAccount);

                // api 정상 처리되면 payAccount의 paybalance + 처리,
                if (withdrawResponseDto.getRsp_code().equals("A0000")) {

                    payAccount.setPayBalance(payAccount.getPayBalance() + transferDto.getTransferAmt());
                    paymentService.updatePayBalanceToDb(payAccount);

                    // 거래 내역에 데이터 추가
                    TransactionHistoryDto transactionHistoryDto = new TransactionHistoryDto();
                    transactionHistoryDto.setBuyer(clientInfo);
                    transactionHistoryDto.setType("충전/환급");
                    transactionHistoryDto.setContent("그린페이_충전");
                    transactionHistoryDto.setTranAmt(transferDto.getTransferAmt());
                    paymentService.saveTransactionHistoryToDb(transactionHistoryDto);

                } else {
                    throw new CustomException(ErrorCode.TRANSFER_NOT_COMPLETED);
                }

            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(Collections.singletonMap("message", "충전 실패"),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>(Collections.singletonMap("message", "충전 성공"), HttpStatus.OK);
    }

    // 그린페이 인출(내 계좌로 송금)
    @Transactional
    @PostMapping(value = "/payment/withdraw")
    public ResponseEntity<?> withdrawPayMoney(@RequestBody TransferDto transferDto,
            @RequestHeader("token") String accessToken) {
        // header: nickName, body: 인출금액, 페이비밀번호
        // 유저정보 추출
        Long clientInfo = paymentService.getClientInfo(accessToken).get();
        Payment payment = paymentService.getPaymentInfo(accessToken).get();
        PayAccount payAccount = paymentService.getPayAccountInfo(accessToken).get();

        // 페이비밀번호 대조 후 (불일치 시 예외 처리)
        if (transferDto.getPayPwd().isEmpty() || !(transferDto.getPayPwd().equals(payment.getPayPassword()))) {
            System.out.println("비번 불일치");
            throw new CustomException(ErrorCode.PASSWORD_NOT_MATCHED);
        }

        // 일치 시 입급 API 호출
        if (transferDto.getPayPwd().equals(payment.getPayPassword())) {
            try {
                // 입금(TR)
                DepositResponseDto depositResponseDto = restTemplateService.transferDeposit(payAccount, "TR",
                        transferDto.getTransferAmt());

                // api 정상 처리되면 payAccount의 paybalance - 처리,
                if (depositResponseDto.getRsp_code().equals("A0000")) {
                    payAccount.setPayBalance(payAccount.getPayBalance() - transferDto.getTransferAmt());
                    paymentService.updatePayBalanceToDb(payAccount);

                    // 거래 내역에 데이터 추가
                    TransactionHistoryDto transactionHistoryDto = new TransactionHistoryDto();
                    transactionHistoryDto.setSeller(clientInfo);
                    transactionHistoryDto.setType("충전/환급");
                    transactionHistoryDto.setContent("그린페이_환급");
                    transactionHistoryDto.setTranAmt(transferDto.getTransferAmt());
                    paymentService.saveTransactionHistoryToDb(transactionHistoryDto);
                } else {
                    throw new CustomException(ErrorCode.TRANSFER_NOT_COMPLETED);
                }
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(Collections.singletonMap("message", "송금 실패"),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        return new ResponseEntity<>(Collections.singletonMap("message", "송금 성공"), HttpStatus.OK);
    }

    // 거래(송금하기)
    @Transactional
    @PostMapping(value = "/payment/transfer")
    public ResponseEntity<?> transferPayMoney(@RequestBody TransferDto transferDto,
            @RequestHeader("token") String accessToken) {
        // header: nickname, body: 판매자nickname(|| id), payPassword, tranAmt, prpduct

        // 구매자 정보
        Long clientInfo = paymentService.getClientInfo(accessToken).get();
        Payment payment = paymentService.getPaymentInfo(accessToken).get();
        PayAccount payAccount = paymentService.getPayAccountInfo(accessToken).get();
        // 판매자 정보
        ProductDto product = transferDto.getProduct();
        Long sellerClientInfo = paymentService.getClientInfoByNickName(product.getSeller()).get();
        PayAccount sellerPayAccount = paymentService.getPayAccountInfo(sellerClientInfo).get();

        // 페이비밀번호 대조 후 (불일치 시 예외 처리)
        if (transferDto.getPayPwd().isEmpty() || !(transferDto.getPayPwd().equals(payment.getPayPassword()))) {
            System.out.println("비번 불일치");
            throw new CustomException(ErrorCode.PASSWORD_NOT_MATCHED);
        }

        // 부족금액 값이 있으면,
        if (payAccount.getPayBalance() < transferDto.getTransferAmt()) {
            // 출금 API 호출(구매자->트레이더스 부족금액만큼)
            try {
                WithdrawRequestDto withdrawRequestDto = new WithdrawRequestDto();
                withdrawRequestDto.setDpsPrintContent("거래:" + payment.getClientInfo().toString());
                withdrawRequestDto.setTranAmt(transferDto.getTransferAmt() - payAccount.getPayBalance());
                withdrawRequestDto.setWdPrintContent("트레이더스_" + product.getName());
                withdrawRequestDto.setTransferPurpose("TR");

                WithdrawResponseDto withdrawResponseDto = restTemplateService.transferWithdraw(withdrawRequestDto,
                        payment, payAccount);

                // api 정상 처리되면 payAccount의 paybalance + 처리,
                if (withdrawResponseDto.getRsp_code().equals("A0000")) {

                    payAccount.setPayBalance(transferDto.getTransferAmt());
                    paymentService.updatePayBalanceToDb(payAccount);

                } else {
                    throw new CustomException(ErrorCode.TRANSFER_NOT_COMPLETED);
                }
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(Collections.singletonMap("message", "충전 실패"),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        // 입금 API 호출(트레이더스 -> 판매자 상품가격만큼)
        try {
            // 입금(TR)
            DepositResponseDto depositResponseDto = restTemplateService.transferDeposit(sellerPayAccount, "TR",
                    transferDto.getTransferAmt(), product);

            // api 정상 처리되면
            if (depositResponseDto.getRsp_code().equals("A0000")) {
                // 구매자 paybalance 상품금액만큼 -처리,
                payAccount.setPayBalance(payAccount.getPayBalance() - transferDto.getTransferAmt());
                paymentService.updatePayBalanceToDb(payAccount);
                // 판매자 paybalance 상품금액만큼 +처리,
                sellerPayAccount.setPayBalance(sellerPayAccount.getPayBalance() + transferDto.getTransferAmt());
                paymentService.updatePayBalanceToDb(sellerPayAccount);

                // 거래내역 저장
                TransactionHistoryDto transactionHistoryDto = new TransactionHistoryDto();
                transactionHistoryDto.setBuyer(clientInfo);
                transactionHistoryDto.setSeller(sellerClientInfo);
                transactionHistoryDto.setContent("트레이드_" + product.getName());
                transactionHistoryDto.setTranAmt(transferDto.getTransferAmt());
                transactionHistoryDto.setType("거래");

                paymentService.saveTransactionHistoryToDb(transactionHistoryDto);

            } else {
                System.out.println("거래 DB저장 오류");
                throw new CustomException(ErrorCode.TRANSFER_NOT_COMPLETED);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(Collections.singletonMap("message", "결제 실패"),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

        productService.updateAfterTransaction(product, clientInfo);

        // 응답 반환
        return new ResponseEntity<>(Collections.singletonMap("message", "결제 성공"), HttpStatus.OK);
    }

    // 거래 내역 조회
    @PostMapping("/payment/transactionHistory")
    public ResponseEntity<List<TransactionHistory>> getTransactionHistory(@RequestHeader("token") String accessToken) {
        // userName -> 유저정보 추출
        Long clientInfo = paymentService.getClientInfo(accessToken).get();
        try {
            List<TransactionHistory> transactionHistoryDto = paymentService.getTransactionHistory(clientInfo);
            if (transactionHistoryDto.isEmpty()) {
                return ResponseEntity.status(HttpStatus.ALREADY_REPORTED)
                        .body(Collections.emptyList());
            }
            return ResponseEntity.ok(transactionHistoryDto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }

}