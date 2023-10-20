/**
 * @author jeongyearim
 * @create date 2023-10-13 14:39:29
 * @modify date 2023-10-13 14:39:29
 */
package com.newus.traders.sns.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CampaignImage {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne
    @JsonBackReference
    private Campaign campaign;

    // @OneToOne
    // @JsonBackReference
    // private UserEntity user;

    String filename;

    String filepath;

    @Builder
    public CampaignImage(String filename) {

        this.filename = filename;
        this.filepath = "/files/" + filename;
    }

    public void setCampaign(Campaign campaign) {

        this.campaign = campaign;
    }
}
