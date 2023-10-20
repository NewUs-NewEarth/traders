/**
 * @author jeongyearim
 * @create date 2023-10-06 15:31:52
 * @modify date 2023-10-06 15:31:52
 */
package com.newus.traders.sns.controller;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.newus.traders.product.form.ProductForm;
import com.newus.traders.sns.dto.CampaignDto;
import com.newus.traders.sns.dto.NewsDto;
import com.newus.traders.sns.dto.SnsDto;
import com.newus.traders.sns.form.CampaignForm;
import com.newus.traders.sns.form.SnsForm;
import com.newus.traders.sns.service.SnsService;
import com.newus.traders.user.entity.User;
import com.newus.traders.user.jwt.TokenProvider;
import com.newus.traders.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SnsController {
    
    private final SnsService snsService;
    private final UserService userService;

    private final TokenProvider tokenProvider;

    public UserDetails getUserDetails(String accessToken) {
        Authentication authentication = tokenProvider.getAuthentication(accessToken);
        Object principal = authentication.getPrincipal();
        return (UserDetails) principal;
    }

    //환경 관련 뉴스(스케쥴러 이용)
    @GetMapping("/sns/showNews")
    public ResponseEntity<List<NewsDto>> showNews() {

        return ResponseEntity.ok(snsService.crawlNews());
    
    }

    //캠페인 리스트 출력
    @GetMapping("/sns/showCampaign")
    public ResponseEntity<List<CampaignDto>> getAllCampaign() {

        return ResponseEntity.ok(snsService.getAllCampaign());
    }

    //캠페인 상세 보기
    @GetMapping("/sns/showCampaign/{id}")
    public ResponseEntity<CampaignDto> getCampaign(@PathVariable("id") Integer id) {

        return ResponseEntity.ok(snsService.getCampaign(id));
    }

    // // 캠페인 등록
    // @PostMapping("/sns/createCampaign")
    // public ResponseEntity<String> createCampaign(@RequestPart("data") CampaignForm campignForm,
    //         @RequestPart("files") List<MultipartFile> files) {
        
    //     return ResponseEntity.ok(snsService.createCampaign(campignForm, files));
    // }

    @GetMapping("/sns/list")
    public ResponseEntity<List<SnsDto>> getAllSns() {

        return ResponseEntity.ok(snsService.getAllSns());
    }

    @GetMapping("/sns/{id}")
    public ResponseEntity<SnsDto> getSns(@PathVariable("id") Long id) {

        return ResponseEntity.ok(snsService.getSns(id));
    }


    //sns 게시물 등록
    @PostMapping("/sns/create")
    public ResponseEntity<String> createSns(@RequestHeader("token") String accessToken,
            @RequestPart("data") SnsForm snsForm,
            @RequestPart("files") List<MultipartFile> files) {
        
        System.out.println(snsForm.getTags());
        //User User = userService.findMemberInfoByEmail(principal.getName());
        return ResponseEntity.ok(snsService.createSns(getUserDetails(accessToken), snsForm, files));
    }


    //게시물 삭제
    @GetMapping("/sns/delete/{id}")
    public ResponseEntity<String> deleteSns(@PathVariable("id") Long id) {

        return ResponseEntity.ok(snsService.deleteSns(id));
    }


    

    
}
