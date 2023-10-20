/**
 * @author jeongyearim
 * @create date 2023-10-06 15:32:19
 * @modify date 2023-10-06 15:32:19
 */
package com.newus.traders.sns.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.newus.traders.sns.entity.Sns;

public interface SnsRepository extends JpaRepository<Sns, Long>{
    
    
}