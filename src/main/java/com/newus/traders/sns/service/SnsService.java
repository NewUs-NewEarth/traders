/**
 * @author jeongyearim
 * @create date 2023-10-11 17:34:57
 * @modify date 2023-10-11 17:34:57
 */

package com.newus.traders.sns.service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.newus.traders.exception.CustomException;
import com.newus.traders.exception.ErrorCode;
import com.newus.traders.product.entity.Product;
import com.newus.traders.product.form.ProductForm;
import com.newus.traders.sns.dto.CampaignDto;
import com.newus.traders.sns.dto.NewsDto;
import com.newus.traders.sns.dto.SnsDto;
import com.newus.traders.sns.entity.Campaign;
import com.newus.traders.sns.entity.CampaignImage;
import com.newus.traders.sns.entity.Sns;
import com.newus.traders.sns.entity.SnsImage;
import com.newus.traders.sns.form.CampaignForm;
import com.newus.traders.sns.form.SnsForm;
import com.newus.traders.sns.repository.CampaignImageRepository;
import com.newus.traders.sns.repository.CampaignRepository;
import com.newus.traders.sns.repository.SnsImageRepository;
import com.newus.traders.sns.repository.SnsRepository;
import com.newus.traders.user.entity.User;
import com.newus.traders.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class SnsService {

    private final SnsRepository snsRepository;
    private final SnsImageRepository snsImageRepository;
    private final CampaignRepository campaignRepository;
    private final CampaignImageRepository campaignImageRepository;
    private final UserRepository userRepository;

    public List<CampaignDto> getAllCampaign() {
        List<Campaign> campaignList = campaignRepository.findAll();
        
        if (campaignList.size() == 0) {
            throw new CustomException(ErrorCode.CAMPAIGN_NOT_FOUND);
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
            throw new CustomException(ErrorCode.CAMPAIGN_NOT_FOUND);
        }

        Campaign campaign = optionalCampaign.get();

        return new CampaignDto(campaign);
    }

    public void saveCampaignImage(List<MultipartFile> files, Campaign campaign) throws Exception {

        String projectPath = System.getProperty("user.dir") + "/src/main/resources/static/files";

        for (MultipartFile file : files) {

            UUID uuid = UUID.randomUUID();
            String filename = uuid + "_" + file.getOriginalFilename();

            File savedFile = new File(projectPath, filename);
            file.transferTo(savedFile);

            CampaignImage campaignImage = new CampaignImage(filename);
            campaignImage.setCampaign(campaign);

            campaignImageRepository.save(campaignImage);
        }
    }

    @Transactional
    public String createCampaign(CampaignForm campaignForm, List<MultipartFile> files) {

        try {
            Campaign campaign = new Campaign(campaignForm);
            campaignRepository.save(campaign);

            saveCampaignImage(files, campaign);

        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            throw new CustomException(ErrorCode.CAMPAIGN_NOT_SAVED);
        }

        return "캠페인 등록을 완료하였습니다.";
    }

    public List<SnsDto> getAllSns() {
        List<Sns> snsList = snsRepository.findAll();

        if (snsList.size() == 0) {
            throw new CustomException(ErrorCode.SNS_NOT_FOUND);
        }

        List<SnsDto> snsDtoList = new ArrayList<>();

        for (Sns sns : snsList) {
            snsDtoList.add(new SnsDto(sns));
        }

        return snsDtoList;
    }

    public SnsDto getSns(Long snsId) {
        Optional<Sns> optionalSns = snsRepository.findById(snsId);

        if (!optionalSns.isPresent()) {
            throw new CustomException(ErrorCode.SNS_NOT_FOUND);
        }
        
        Sns sns = optionalSns.get();

        return new SnsDto(sns);
    }

    public void saveImage(List<MultipartFile> files, Sns sns) throws Exception {

        String projectPath = System.getProperty("user.dir") + "/src/main/resources/static/files";

        for (MultipartFile file : files) {

            UUID uuid = UUID.randomUUID();
            String filename = uuid + "_" + file.getOriginalFilename();

            File savedFile = new File(projectPath, filename);
            file.transferTo(savedFile);

            SnsImage snsImage = new SnsImage(filename);
            snsImage.setSns(sns);

            snsImageRepository.save(snsImage);
        }
    }

    public void deleteImage(List<Integer> removedFiles) throws Exception {

        String projectPath = System.getProperty("user.dir") + "/src/main/resources/static/files";

        for (Integer id : removedFiles) {
            Optional<SnsImage> imageOptional = snsImageRepository.findById(id);
            if (imageOptional.isPresent()) {
                SnsImage snsImage = imageOptional.get();
                String filename = snsImage.getFilename();
                System.out.println(filename);

                File fileToDelete = new File(projectPath, filename);
                if (fileToDelete.exists()) {
                    if (fileToDelete.delete()) {
                        snsImageRepository.delete(snsImage);
                        System.out.println("아이ㅡ=스");
                    } else {
                        throw new Exception("파일을 삭제하지 못했습니다.");
                    }
                } else {
                    throw new Exception("파일을 찾을 수 없습니다.");
                }
            } else {
                throw new Exception("해당 이미지를 찾을 수 없습니다.");
            }
        }
    }

    @Transactional
    public String createSns(UserDetails userDetails, SnsForm snsForm, List<MultipartFile> files) {
        
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Sns sns = new Sns(user, snsForm);
        snsRepository.save(sns);

        try {

            saveImage(files, sns);

        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            throw new CustomException(ErrorCode.SNS_NOT_SAVED);
        }

        return "SNS 게시글 등록을 완료하였습니다.";
    }
    

    public String deleteSns(Long snsId) {

        Sns sns = snsRepository.findById(snsId)
                .orElseThrow(() -> new CustomException(ErrorCode.SNS_NOT_FOUND));

        List<Integer> imagesToDelete = sns.getImages().stream()
                .map(image -> image.getId())
                .collect(Collectors.toList());

        snsRepository.delete(sns);
        /* 
        try {
            deleteImage(imagesToDelete);

            System.out.println(
                "아이스크림"
            );

        } catch (Exception exception) {

            System.out.println(exception.toString());
            System.out.println("실행왜그래");
            //throw new CustomException(ErrorCode.SNS_NOT_DELETED);
        }
        */

        return "SNS 게시물 삭제를 완료하였습니다.";
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
                
                //기사 링크 가져오기
                Element linkElement = article.select("h4.titles a").first();
                String baseUrl = "https://www.hkbs.co.kr/";
                String articleLink = baseUrl + linkElement.attr("href");

                System.out.println("이미지 URL: " + imageUrl);
                System.out.println("기사 제목: " + articleTitle);
                System.out.println("기사 요약: " + summaryTitle);
                System.out.println("기사 링크: " + articleLink);
                System.out.println("---------------------------------------------------");

                // 추출한 데이터를 DTO에 담아 리스트에 추가
                NewsDto NewsDto = new NewsDto();
                NewsDto.setImageUrl(imageUrl);
                NewsDto.setArticleTitle(articleTitle);
                NewsDto.setSummaryTitle(summaryTitle);
                NewsDto.setArticleLink(articleLink);
                newsDtoList.add(NewsDto);

            }
        } catch (Exception e) {
            // 예외 처리
            e.printStackTrace();
        }
        return newsDtoList;
    }


}
