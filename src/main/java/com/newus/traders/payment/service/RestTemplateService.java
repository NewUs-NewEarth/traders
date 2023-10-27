/**
 * @author ahrayi
 * @create date 2023-10-10 09:21:11
 * @modify date 2023-10-17 14:15:23
 * @Desc 외부 API(오픈뱅킹) 관련 service
 */

package com.newus.traders.payment.service;

import java.math.BigInteger;
import java.net.URI;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Base64.Encoder;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.apache.commons.codec.Charsets;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.newus.traders.payment.dto.DepositRequestDto;
import com.newus.traders.payment.dto.DepositResponseDto;
import com.newus.traders.payment.dto.InquiryRcvRequestDto;
import com.newus.traders.payment.dto.InquiryRcvResponseDto;
import com.newus.traders.payment.dto.MeResponseDto;
import com.newus.traders.payment.dto.PayAccountDto;
import com.newus.traders.payment.dto.PaymentDto;
import com.newus.traders.payment.dto.RegisterResponseDto;
import com.newus.traders.payment.dto.ReqList;
import com.newus.traders.payment.dto.TokenRequestDto;
import com.newus.traders.payment.dto.TokenResponseDto;
import com.newus.traders.payment.dto.WithdrawRequestDto;
import com.newus.traders.payment.dto.WithdrawResponseDto;
import com.newus.traders.payment.entity.PayAccount;
import com.newus.traders.payment.entity.Payment;
import com.newus.traders.product.dto.ProductDto;

@Service
public class RestTemplateService {

    // https://openapi.openbanking.or.kr
    String base_uri = "https://675f6818-da9a-4047-927b-e08e3afb8de1.mock.pstmn.io";

    @Value("${traders.client_id}")
    private String clientId;
    @Value("${traders.client_secret}")
    private String clientSecret;
    @Value("${traders.client_use_code}")
    private String clientUseCode;
    @Value("${traders.ctr_account_num}")
    private String ctrAccountNum;
    @Value("${traders.bank_code_std}")
    private String bankCodeStd;
    @Value("${traders.deposit_account_num}")
    private String dpAccountNum;
    @Value("${traders.cms_num}")
    private String cmsNum;
    @Value("${traders.access_token}")
    private String accessTokenSa;
    @Value("${traders.wd_pass_phrase}")
    private String wdPassPhrase;

    // 사용자인증 API(authorize)
    public RegisterResponseDto authorizeUser(PaymentDto paymentDto) {

        // Long clientInfo = paymentDto에서 받아오기;
        int clientInfo = 1;
        String redirectUri = "http://localhost:8080/api/payment/register2";
        String state = generateState();
        // 세션 또는 별도의 저장 공간에 상태 토큰을 저장

        URI uri = UriComponentsBuilder
                .fromUriString(base_uri)
                .path("/ouath/2.0/authorize")
                .queryParam("response_type", "code")
                .queryParam("client_id", clientId)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("scope", "login inquiry transfer")
                .queryParam("client_info", clientInfo)
                .queryParam("state", state)
                .queryParam("auth_type", 0) // paymentService.getAuthType(clientInfo);
                .queryParam("cellphone_cert", "Y")
                .encode(Charsets.toCharset("UTF-8"))
                .build()
                .toUri();

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<RegisterResponseDto> result = restTemplate.getForEntity(uri, RegisterResponseDto.class);

        // {재인증(authtype==2) 시 headers추가}
        return result.getBody();
    }

    // 토큰발급 API(token)
    public TokenResponseDto getToken(String code) {

        URI uri = UriComponentsBuilder
                .fromUriString(base_uri)
                .path("/oauth/2.0/token")
                .encode(Charsets.toCharset("UTF-8"))
                .build()
                .toUri();

        TokenRequestDto request = new TokenRequestDto();
        request.setCode(code);
        request.setClient_id(clientId);
        request.setClient_secret(clientSecret);
        request.setRedirect_uri("http://localhost:8080/api/payment/register2");
        request.setGrant_type("authorization_code");

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<TokenResponseDto> response = restTemplate.postForEntity(uri, request, TokenResponseDto.class);

        return response.getBody();
    }

    // 사용자정보조회 API
    public MeResponseDto getUserInfo(String accessToken, String userSeqNo) {
        try {
            URI uri = UriComponentsBuilder
                    .fromUriString(base_uri)
                    .path("/v2.0/user/me")
                    .queryParam("user_seq_no", userSeqNo)
                    .encode(Charsets.toCharset("UTF-8"))
                    .build()
                    .toUri();

            Map<String, String> headers = new HashMap<>();
            headers.put("Authorization", "Bearer " + accessToken);

            HttpEntity<?> entity = new HttpEntity<Object>(headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<MeResponseDto> result = restTemplate.exchange(uri, HttpMethod.GET, entity,
                    MeResponseDto.class);

            return result.getBody();

        } catch (Exception e) {
            System.out.println(e.getStackTrace());
            return new MeResponseDto(getCi(userSeqNo));
        }
    }

    // 수취조회 API
    public InquiryRcvResponseDto receiveInquiry(PayAccountDto payAccountDto, String transferPurpose, int transAmt) {

        URI uri = UriComponentsBuilder
                .fromUriString(base_uri)
                .path("/v2.0/inquiry/receive")
                .encode(Charsets.toCharset("UTF-8"))
                .build()
                .toUri();

        InquiryRcvRequestDto request = new InquiryRcvRequestDto();

        String bankTranId = clientUseCode + "U" + generateRandomBankTranId();
        // {db(memory)에 저장하는 코드}

        int ranNum = generateRandomNum();

        if (transferPurpose == "AU") {
            request.setPrintContent("그린" + ranNum);
        } else { // TR
            request.setPrintContent("그린페이환급");
        }

        request.setBankTranId(bankTranId);
        request.setCntrAccountType("N");
        request.setCntrAccountNum(ctrAccountNum);
        request.setBankCodeStd(bankCodeStd);
        request.setAccountNum(dpAccountNum);
        request.setTransAmt(transAmt);
        request.setReqClientName(payAccountDto.getUserName()); // 고객성명가져오기
        request.setReqClientBankCode(payAccountDto.getBankCodeStd().trim());
        request.setReqClientAccountNum(payAccountDto.getAccountNum().trim());
        request.setReqClientNum(payAccountDto.getClientInfo().toString());
        request.setTransferPurpose(transferPurpose);
        request.setCmsNum(cmsNum);

        RequestEntity<InquiryRcvRequestDto> requestEntity = RequestEntity
                .post(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + accessTokenSa)
                .body(request);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<InquiryRcvResponseDto> response = restTemplate.exchange(requestEntity,
                InquiryRcvResponseDto.class);

        return response.getBody();
    }

    // 입금 이체 API(트레이더스 -> 고객)_인증
    public DepositResponseDto transferDeposit(PayAccountDto payAccountDto, String transferPurpose, int tran_amt,
            int ranNum) {

        URI uri = UriComponentsBuilder
                .fromUriString(base_uri)
                .path("/v2.0/transfer/deposit/acnt_num")
                .encode(Charsets.toCharset("UTF-8"))
                .build()
                .toUri();

        String bankTranId = clientUseCode + "U" + generateRandomBankTranId();
        // {db(memory)에 저장하는 코드}

        ReqList reqList = new ReqList();
        reqList.setTranNo(1);
        reqList.setBankTranId(bankTranId);
        reqList.setBankCodeStd(payAccountDto.getBankCodeStd().trim());
        reqList.setAccountNum(payAccountDto.getAccountNum().trim());
        reqList.setAccountHolderName(payAccountDto.getUserName());
        reqList.setTranAmt(tran_amt);
        reqList.setReqClientName(payAccountDto.getUserName());
        reqList.setReqClientBankCode(payAccountDto.getBankCodeStd().trim());
        reqList.setReqClientAccountNum(payAccountDto.getAccountNum().trim());
        reqList.setReqClientNum(payAccountDto.getClientInfo().toString());
        reqList.setTransferPurpose(transferPurpose);
        reqList.setCmsNum(cmsNum);

        DepositRequestDto request = new DepositRequestDto();
        request.setCtrAccountType("N");
        request.setCtrAccountNum(ctrAccountNum);
        request.setWdPassPhrase(wdPassPhrase);
        if (transferPurpose == "AU") {
            reqList.setPrintContent("그린" + ranNum);
            request.setWdPrintContent(payAccountDto.getUserName() + ranNum);
        } else {
            reqList.setPrintContent("그린페이환급");
            request.setWdPrintContent(payAccountDto.getUserName() + "환급");
        }
        request.setNameCheckOption("on");
        request.setTran_dtime(getDateTime14());
        request.setReqCnt(1);
        request.setReqList(reqList);

        RequestEntity<DepositRequestDto> requestEntity = RequestEntity
                .post(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + accessTokenSa)
                .body(request);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<DepositResponseDto> response = restTemplate.exchange(requestEntity, DepositResponseDto.class);

        return response.getBody();
    }

    // 입금 이체 API(트레이더스 -> 고객)_환급
    public DepositResponseDto transferDeposit(PayAccount payAccount, String transferPurpose, int tran_amt) {

        URI uri = UriComponentsBuilder
                .fromUriString(base_uri)
                .path("/v2.0/transfer/deposit/acnt_num")
                .encode(Charsets.toCharset("UTF-8"))
                .build()
                .toUri();

        String bankTranId = clientUseCode + "U" + generateRandomBankTranId();
        // {db(memory)에 저장하는 코드}

        ReqList reqList = new ReqList();
        reqList.setTranNo(1);
        reqList.setBankTranId(bankTranId);
        reqList.setBankCodeStd(payAccount.getBankCodeStd().trim());
        reqList.setAccountNum(payAccount.getAccountNum().trim());
        reqList.setAccountHolderName(payAccount.getUserName());
        reqList.setTranAmt(tran_amt);
        reqList.setReqClientName(payAccount.getUserName());
        reqList.setReqClientBankCode(payAccount.getBankCodeStd().trim());
        reqList.setReqClientAccountNum(payAccount.getAccountNum().trim());
        reqList.setReqClientNum(payAccount.getClientInfo().toString());
        reqList.setTransferPurpose(transferPurpose);
        reqList.setCmsNum(cmsNum);

        DepositRequestDto request = new DepositRequestDto();
        request.setCtrAccountType("N");
        request.setCtrAccountNum(ctrAccountNum);
        request.setWdPassPhrase(wdPassPhrase);
        reqList.setPrintContent("그린페이환급");
        request.setWdPrintContent(payAccount.getUserName() + "환급");

        request.setNameCheckOption("on");
        request.setTran_dtime(getDateTime14());
        request.setReqCnt(1);
        request.setReqList(reqList);

        RequestEntity<DepositRequestDto> requestEntity = RequestEntity
                .post(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + accessTokenSa)
                .body(request);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<DepositResponseDto> response = restTemplate.exchange(requestEntity, DepositResponseDto.class);

        return response.getBody();
    }

    // 입금 이체 API(트레이더스 -> 고객)_거래
    public DepositResponseDto transferDeposit(PayAccount payAccount, String transferPurpose, int tran_amt,
            ProductDto productDto) {

        URI uri = UriComponentsBuilder
                .fromUriString(base_uri)
                .path("/v2.0/transfer/deposit/acnt_num")
                .encode(Charsets.toCharset("UTF-8"))
                .build()
                .toUri();

        String bankTranId = clientUseCode + "U" + generateRandomBankTranId();
        // {db(memory)에 저장하는 코드}

        ReqList reqList = new ReqList();
        reqList.setTranNo(1);
        reqList.setBankTranId(bankTranId);
        reqList.setBankCodeStd(payAccount.getBankCodeStd().trim());
        reqList.setAccountNum(payAccount.getAccountNum().trim());
        reqList.setAccountHolderName(payAccount.getUserName());
        reqList.setTranAmt(tran_amt);
        reqList.setReqClientName(payAccount.getUserName());
        reqList.setReqClientBankCode(payAccount.getBankCodeStd().trim());
        reqList.setReqClientAccountNum(payAccount.getAccountNum().trim());
        reqList.setReqClientNum(payAccount.getClientInfo().toString());
        reqList.setTransferPurpose(transferPurpose);
        reqList.setCmsNum(cmsNum);

        DepositRequestDto request = new DepositRequestDto();
        request.setCtrAccountType("N");
        request.setCtrAccountNum(ctrAccountNum);
        request.setWdPassPhrase(wdPassPhrase);
        reqList.setPrintContent("트레이더스_" + productDto.getName());
        request.setWdPrintContent(payAccount.getUserName() + "거래");

        request.setNameCheckOption("on");
        request.setTran_dtime(getDateTime14());
        request.setReqCnt(1);
        request.setReqList(reqList);

        RequestEntity<DepositRequestDto> requestEntity = RequestEntity
                .post(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + accessTokenSa)
                .body(request);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<DepositResponseDto> response = restTemplate.exchange(requestEntity, DepositResponseDto.class);

        return response.getBody();
    }

    // 출금 이체 API (고객 -> 트레이더스)
    public WithdrawResponseDto transferWithdraw(WithdrawRequestDto request, Payment payment, PayAccount payAccount) {
        URI uri = UriComponentsBuilder
                .fromUriString(base_uri)
                .path("/v2.0/transfer/withdraw/acnt_num")
                .encode(Charsets.toCharset("UTF-8"))
                .build()
                .toUri();

        request.setBankTranId(generateRandomBankTranId());
        request.setCtrAccountType("N");
        request.setWdBankCodeStd(payAccount.getBankCodeStd());
        request.setWdAccountNum(payAccount.getAccountNum());
        request.setUserSeqNo(payment.getUserSeqNo());
        request.setTran_dtime(getDateTime14());
        request.setReqClientName(payment.getUserName());
        request.setReqClientBankCode(payAccount.getBankCodeStd());
        request.setReqClientAccountNum(payAccount.getAccountNum());
        request.setReqClientNum(payment.getClientInfo().toString());

        request.setRecvClientName("트레이더스");
        request.setRecvClientBankCode(bankCodeStd);
        request.setRecvClientAccountNum(ctrAccountNum);

        RequestEntity<WithdrawRequestDto> requestEntity = RequestEntity
                .post(uri)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + accessTokenSa)
                .body(request);

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<WithdrawResponseDto> response = restTemplate.exchange(requestEntity,
                WithdrawResponseDto.class);

        return response.getBody();
    }

    // 상태 토큰 생성
    private String generateState() {
        SecureRandom random = new SecureRandom();
        return new BigInteger(130, random).toString(32);
    }

    // 상태 토큰 비교
    private boolean compareState(String responseState) {
        return true;
    }

    // 이용기관 부여번호 생성
    private String generateRandomBankTranId() {

        int leftLimit = 48; // '0'
        int rightLimit = 122; // 'z'
        int targetStringLength = 9;
        Random random = new Random();

        String generatedString = random.ints(leftLimit, rightLimit + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(targetStringLength)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();

        // 거래고유번호 유일성체크 및 저장(1d)

        return generatedString.toUpperCase();
    }

    // 랜덤3자리 숫자 생성 - 중복검사 필요
    public int generateRandomNum() {
        int min = 100;
        int max = 999;
        SecureRandom secureRandom = new SecureRandom();
        return secureRandom.nextInt(max - min + 1) + min;
    }

    // dtm(YYYYMMddHHmmss)
    private String getDateTime14() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("YYYYMMddHHmmss"));
    }

    // --임의-- userCI 생성
    public String getCi(String userSeqNo) {
        // 임의코드는 '사용자일련번호+이용기관코드'로 생성하기로 함
        String text = userSeqNo + clientUseCode;
        byte[] textToByte = text.getBytes();

        Encoder encode = Base64.getEncoder();

        // Base64 인코딩
        byte[] encodeByte = encode.encode(textToByte);

        return new String(encodeByte);
    }

}
