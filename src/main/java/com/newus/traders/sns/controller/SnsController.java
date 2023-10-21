/**
 * @author jeongyearim
 * @create date 2023-10-06 15:31:52
 * @modify date 2023-10-06 15:31:52
 */
package com.newus.traders.sns.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.newus.traders.sns.dto.CampaignDto;
import com.newus.traders.sns.dto.NewsDto;
import com.newus.traders.sns.service.SnsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SnsController {
    
    private final SnsService snsService;

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

        CampaignDto campaignDto = snsService.getCampaign(id);
        System.out.println(campaignDto.getTitle());
        return ResponseEntity.ok(snsService.getCampaign(id));
    }

    
}
