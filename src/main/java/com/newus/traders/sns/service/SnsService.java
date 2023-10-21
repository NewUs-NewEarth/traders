/**
 * @author jeongyearim
 * @create date 2023-10-11 17:34:57
 * @modify date 2023-10-11 17:34:57
 */

package com.newus.traders.sns.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.newus.traders.exception.CustomException;
import com.newus.traders.exception.ErrorCode;
import com.newus.traders.sns.dto.CampaignDto;
import com.newus.traders.sns.dto.NewsDto;
import com.newus.traders.sns.entity.Campaign;
import com.newus.traders.sns.repository.CampaignRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class SnsService {

    // private final SnsRepository snsRepository;
    private final CampaignRepository campaignRepository;

    public List<CampaignDto> getAllCampaign() {
        List<Campaign> campaignList = campaignRepository.findAll();

        if (campaignList.size() == 0) {
            // 리스트가 0일 경우에 --- 메세지를 좀 수정할 필요는 보임!
            throw new CustomException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        List<CampaignDto> campaignDtoList = new ArrayList<>();

        for (Campaign campaign : campaignList) {
            campaignDtoList.add(new CampaignDto(campaign));
        }

        return campaignDtoList;
    }

    public CampaignDto getCampaign(int campaignId) {
        Optional<Campaign> optionalCampaign = campaignRepository.findById(campaignId);

        if (!optionalCampaign.isPresent()) {
            throw new CustomException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        Campaign campaign = optionalCampaign.get();

        return new CampaignDto(campaign);
    }

    

    @Scheduled(fixedRate = 3 * 24 * 60 * 60 * 1000) // 3일마다 실행(뉴스 업데이트)
    public List<NewsDto> crawlNews() {
        List<NewsDto> newsDtoList = new ArrayList<>(); //리스트 초기화
        
        try {
            // 크롤링할 뉴스 사이트 URL 설정
            String newsUrl = "http://www.hkbs.co.kr/news/articleList.html?sc_sub_section_code=S2N5&view_type=sm";

            // Jsoup을 사용하여 웹 페이지에 연결
            Document document = Jsoup.connect(newsUrl).get();

            // 원하는 정보를 추출하기 위한 CSS 선택자 설정
            String cssSelector = "ul.type2 li"; // 예시 CSS 선택자

            // 선택자로 원하는 요소들을 가져옴
            Elements articles = document.select(cssSelector);

            

            // 뉴스 요소들을 순회하며 데이터 추출
            for (Element article : articles) {

                // 이미지 URL 가져오기
                Element imgElement = article.select("a.thumb img").first();
                String imageUrl = imgElement.attr("src");

                // 기사 제목 가져오기
                Element titleElement = article.select("h4.titles a").first();
                String articleTitle = titleElement.text();

                // 기사 내용 가져오기
                Element summaryElement = article.select("p.lead a").first();
                String summaryTitle = summaryElement.text();


                System.out.println("이미지 URL: " + imageUrl);
                System.out.println("기사 제목: " + articleTitle);
                System.out.println("기사 요약: " + summaryTitle);
                System.out.println("---------------------------------------------------");

                // 추출한 데이터를 DTO에 담아 리스트에 추가
                NewsDto NewsDto = new NewsDto();
                NewsDto.setImageUrl(imageUrl);
                NewsDto.setArticleTitle(articleTitle);
                NewsDto.setSummaryTitle(summaryTitle);
                newsDtoList.add(NewsDto);

            }
        } catch (Exception e) {
            // 예외 처리
            e.printStackTrace();
        }
        return newsDtoList;
    }


}
