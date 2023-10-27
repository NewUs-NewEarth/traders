/**
 * @author ahrayi
 * @create date 2023-10-04 11:18:39
 * @modify date 2023-10-13 12:04:22
 */

package com.newus.traders.payment.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.newus.traders.exception.CustomException;
import com.newus.traders.exception.ErrorCode;
import com.newus.traders.payment.dto.PayAccountDto;
import com.newus.traders.payment.dto.PaymentDto;
import com.newus.traders.payment.dto.TransactionHistoryDto;
import com.newus.traders.payment.entity.PayAccount;
import com.newus.traders.payment.entity.Payment;
import com.newus.traders.payment.entity.TransactionHistory;
import com.newus.traders.payment.repository.PayAccountRepository;
import com.newus.traders.payment.repository.PaymentRepository;
import com.newus.traders.payment.repository.TransactionHistoryRepository;
import com.newus.traders.user.entity.User;
import com.newus.traders.user.jwt.TokenProvider;
import com.newus.traders.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import net.nurigo.sdk.NurigoApp;
import net.nurigo.sdk.message.exception.NurigoMessageNotReceivedException;
import net.nurigo.sdk.message.model.Message;
import net.nurigo.sdk.message.service.DefaultMessageService;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final PayAccountRepository payAccountRepository;
    private final TransactionHistoryRepository transactionHistoryRepository;
    private final UserRepository userRepository;
    private final TokenProvider tokenProvider;
    private ConcurrentHashMap<String, String> authNums = new ConcurrentHashMap<>();

    @Value("${sms.api_key}")
    private String apiKey;
    @Value("${sms.api_secret}")
    private String apiSecret;
    @Value("${sms.sphone}")
    private String sphone;

    // 토큰으로 clientInfo 추출
    public Optional<Long> getClientInfo(String accessToken) {
        Authentication authentication = tokenProvider.getAuthentication(accessToken);
        Object principal = authentication.getPrincipal();
        UserDetails userDetails = (UserDetails) principal;
        String nickName = userDetails.getUsername();

        Optional<User> user = userRepository.findByUsername(nickName);

        if (user.isPresent()) {
            Long clientInfo = user.get().getUserId();
            return Optional.of(clientInfo);
        } else {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }
    }

    public Optional<Long> getClientInfoByNickName(String nickName) {
        Optional<User> user = userRepository.findByUsername(nickName);

        if (user.isPresent()) {
            Long clientInfo = user.get().getUserId();
            return Optional.of(clientInfo);
        } else {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }
    }

    // accessToken로 Payment 정보 반환
    public Optional<Payment> getPaymentInfo(String accessToken) {
        Optional<Payment> payment = paymentRepository.findByClientInfo(getClientInfo(accessToken).get());

        if (!payment.isPresent()) {
            throw new CustomException(ErrorCode.PAYMENT_NOT_FOUND);
        } else {
            return payment;
        }
    }

    // accessToken으로 PayAccount 정보 반환
    public Optional<PayAccount> getPayAccountInfo(String accessToken) {
        Optional<PayAccount> payAccount = payAccountRepository.findByClientInfo(getClientInfo(accessToken).get());

        if (!payAccount.isPresent()) {
            throw new CustomException(ErrorCode.PAYACCOUNT_NOT_FOUND);
        } else {
            return payAccount;
        }
    }

    // clientInfo로 PayAccount 정보 반환
    public Optional<PayAccount> getPayAccountInfo(Long clientInfo) {
        Optional<PayAccount> payAccount = payAccountRepository.findByClientInfo(clientInfo);

        if (!payAccount.isPresent()) {
            throw new CustomException(ErrorCode.PAYACCOUNT_NOT_FOUND);
        } else {
            return payAccount;
        }
    }

    // clientInfo로 페이가입여부 확인
    public boolean checkPayMember(Long ClientInfo) {
        Optional<Payment> payment = paymentRepository.findByClientInfo(ClientInfo);
        if (payment.isPresent()) {
            return true;
        } else {
            return false;
        }
    }

    // clientInfo로 계좌등록여부 확인
    public boolean checkAccntMember(Long clientInfo) {
        Optional<PayAccount> payAccount = payAccountRepository.findByClientInfo(clientInfo);
        if (payAccount.isPresent()) {
            return true;
        } else {
            return false;
        }
    }

    // 회원 등급 판별(0:페이 미가입, 1:계좌 미등록, 2:계좌 등록)
    public int getMemberGrade(String accessToken) {
        Long clientInfo = getClientInfo(accessToken).get();

        if (checkAccntMember(clientInfo)) {
            return 2;
        } else if (checkPayMember(clientInfo)) {
            return 1;
        }
        return 0;
    }

    // 사용자인증타입(auth_type) 판별(최초등록:0, 재인증:2)
    public int getAuthType(Long clientInfo) {
        Optional<Payment> optionalPayment = paymentRepository.findById(clientInfo);

        if (!optionalPayment.isPresent()) {
            return 0;
        }
        return 2;
    }

    // 페이 신규 등록
    @Transactional
    public Payment savePaymentDtoToDb(PaymentDto paymentDto, String accessToken) {

        Payment payment = new Payment();
        payment.setClientInfo(getClientInfo(accessToken).get());
        payment.setUserName(paymentDto.getUserName());
        payment.setUserInfo(paymentDto.getUserInfo());
        payment.setUserGender(paymentDto.getUserGender());
        payment.setCellCarrier(paymentDto.getCellCarrier());
        payment.setUserCellNo(paymentDto.getUserCellNo());
        payment.setAgreeYn(paymentDto.getAgreeYn());
        payment.setAgreeDtime(paymentDto.getAgreeDtime());
        payment.setPayPassword(paymentDto.getPayPassword());

        payment.setAccessToken(paymentDto.getAccessToken());
        payment.setRefreshToken(paymentDto.getRefreshToken());
        payment.setExpiresIn(paymentDto.getExpiresIn());
        payment.setUserSeqNo(paymentDto.getUserSeqNo());
        payment.setUserCi(paymentDto.getUserCi());

        return paymentRepository.save(payment);
    }

    // 페이 계좌 등록
    public PayAccount savePayAccountDtoToDb(PayAccountDto payAccountDto) {
        PayAccount payAccount = new PayAccount();
        payAccount.setClientInfo(payAccountDto.getClientInfo());
        payAccount.setUserName(payAccountDto.getUserName());
        payAccount.setAccountNum(payAccountDto.getAccountNum());
        payAccount.setBankCodeStd(payAccountDto.getBankCodeStd());
        payAccount.setAgreeWdTr(getDateTime());
        payAccount.setAddr1(payAccountDto.getAddr1());
        payAccount.setAddr2(payAccountDto.getAddr2());

        return payAccountRepository.save(payAccount);
    }

    public PayAccount updatePayBalanceToDb(PayAccount payAccount) {
        return payAccountRepository.save(payAccount);
    }

    // 거래내역 저장
    public TransactionHistory saveTransactionHistoryToDb(TransactionHistoryDto transactionHistoryDto) {
        TransactionHistory transactionHistory = new TransactionHistory();
        transactionHistory.setType(transactionHistoryDto.getType());
        transactionHistory.setContent(transactionHistoryDto.getContent());
        transactionHistory.setTranAmt(transactionHistoryDto.getTranAmt());
        transactionHistory.setSeller(transactionHistoryDto.getSeller());
        transactionHistory.setBuyer(transactionHistoryDto.getBuyer());
        transactionHistory.setTransactionDtime(getDateTimeString());

        return transactionHistoryRepository.save(transactionHistory);
    }

    // 거래내역 조회
    public List<TransactionHistory> getTransactionHistory(Long clientInfo) {
        // buyer 또는 seller와 clientInfo를 비교하여 필터링
        List<TransactionHistory> filteredTransactions = transactionHistoryRepository.findByBuyerOrSeller(clientInfo,
                clientInfo);
        return filteredTransactions;
    }

    // 문자 전송
    public void sendSms(String rphone) {

        String authNum = getSmsAuthNum();
        authNums.put(rphone, authNum);
        System.out.println("@@@@@@인증번호@@@@@@ " + authNum);
        DefaultMessageService messageService = NurigoApp.INSTANCE.initialize(apiKey,
                apiSecret,
                "https://api.solapi.com");

        Message message = new Message();
        message.setFrom(sphone);
        message.setTo(rphone);
        message.setText("[TRADERS]\n" + "인증번호는 " + authNum + "입니다.");

        try {
            messageService.send(message);
        } catch (NurigoMessageNotReceivedException exception) {
            // 발송 실패한 메시지 확인
            System.out.println(exception.getFailedMessageList());
            System.out.println(exception.getMessage());
        } catch (Exception exception) {
            System.out.println(exception.getMessage());
        }
    }

    // 문자인증번호 일치 확인
    public boolean verifyAuthNum(String rphone, String inputAuthNum) {
        if (authNums.get(rphone).equals(inputAuthNum)) {
            return true;
        } else {
            return false;
        }
    }

    // 만료일 계산
    public LocalDateTime getExpirationDate(String expiresIn_s) {
        LocalDateTime expDateTime = LocalDateTime.now().plusSeconds(Long.parseLong(expiresIn_s));
        return expDateTime;
    }

    private String getDateTime() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("YYYYMMddHHmmssSSS"));
    }

    private String getDateTimeString() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("YYYY-MM-dd HH:mm"));
    }

    // 문자인증번호 생성
    public String getSmsAuthNum() {
        SecureRandom random = new SecureRandom();
        String verNum = "";
        for (int i = 0; i < 6; i++) {
            verNum += random.nextInt(10);
        }
        return verNum;
    }

    // 출석체크 포인트 지급
    public void addBalanceForAttendance(String userName, int pointAmt) {
        Long clientInfo = getClientInfo(userName).get();
        PayAccount payAccount = getPayAccountInfo(clientInfo).get();

        payAccount.setPayBalance(payAccount.getPayBalance() + pointAmt);
        updatePayBalanceToDb(payAccount);

        TransactionHistoryDto transactionHistoryDto = new TransactionHistoryDto();
        transactionHistoryDto.setSeller(clientInfo);
        transactionHistoryDto.setContent("포인트_출석체크");
        transactionHistoryDto.setTranAmt(pointAmt);
        transactionHistoryDto.setTransactionDtime(getDateTimeString());
        transactionHistoryDto.setType("포인트");

        saveTransactionHistoryToDb(transactionHistoryDto);
    }

}