/**
 * @author jeongyearim
 * @create date 2023-10-11 13:46:58
 * @modify date 2023-10-11 13:46:58
 */
package com.newus.traders.sns.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.newus.traders.sns.type.CampaignStatus;

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

    @Enumerated(EnumType.STRING)
    private CampaignStatus status;

    private String tags; // 태그

    // @ElementCollection
    // private List<String> images;

    public void expireCampaign(){  //캠페인이 만료되었을 때
        this.status = CampaignStatus.EXPIRED;
    }

    
}
