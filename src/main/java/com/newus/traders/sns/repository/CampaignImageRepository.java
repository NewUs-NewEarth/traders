/**
 * @author jeongyearim
 * @create date 2023-10-16 09:35:03
 * @modify date 2023-10-16 09:35:03
 */
package com.newus.traders.sns.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.newus.traders.sns.entity.CampaignImage;

public interface CampaignImageRepository extends JpaRepository<CampaignImage, Integer>{
    
    
}
