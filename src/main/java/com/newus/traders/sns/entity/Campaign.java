/**
 * @author jeongyearim
 * @create date 2023-10-11 13:46:58
 * @modify date 2023-10-11 13:46:58
 */
package com.newus.traders.sns.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.newus.traders.sns.form.CampaignForm;

// import com.newus.traders.sns.type.CampaignStatus;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data  // 수정: Lombok을 사용하려면 Data 애노테이션을 추가
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Campaign {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private Date dueDate;
    private String organizer;
    private String title;

    @Column(length = 1000) 
    private String description;  // 챌린지 의의

    @Column(length = 1000) 
    private String verificationMethod;  // 인증 방법

    private String tags; // 태그

    @OneToMany(mappedBy = "campaign", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<CampaignImage> images;

    @Builder
    public Campaign(CampaignForm campaignForm) {
        this.dueDate = campaignForm.getDueDate();
        this.organizer = campaignForm.getOrganizer();  
	    this.title = campaignForm.getTitle();  
	    this.description = campaignForm.getDescription();  
	    this.verificationMethod = campaignForm.getVerificationMethod();  
	    this.tags = campaignForm.getTags();  
    } 
    
}
