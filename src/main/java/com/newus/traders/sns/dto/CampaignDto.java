/**
 * @author jeongyearim
 * @create date 2023-10-11 12:09:14
 * @modify date 2023-10-11 12:09:14
 */
package com.newus.traders.sns.dto;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.newus.traders.product.entity.Product;
import com.newus.traders.sns.entity.Campaign;
import com.newus.traders.sns.entity.CampaignImage;
// import com.newus.traders.sns.type.CampaignStatus;
import com.newus.traders.sns.entity.SnsImage;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CampaignDto {
   
    private int id;

    private Date dueDate;
    private String organizer;
    private String title;

   
    private String description;  // 챌린지 의의
    private String verificationMethod;  // 인증 방법

    private List<CampaignImage> images;
    private String tags; // 태그

    @Builder
    public CampaignDto(Campaign campaign) {
        this.id = campaign.getId();
        this.dueDate = campaign.getDueDate();
        this.organizer = campaign.getOrganizer();
        this.title = campaign.getTitle();
        this.description = campaign.getDescription();
        this.verificationMethod = campaign.getVerificationMethod();
        this.images = campaign.getImages();
        this.tags = campaign.getTags();
        
    }
    
}
