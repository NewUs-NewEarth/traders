/**
 * @author jeongyearim
 * @create date 2023-10-12 16:40:56
 * @modify date 2023-10-12 16:40:56
 */
package com.newus.traders.sns.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.newus.traders.sns.entity.SnsImage;

public interface SnsImageRepository extends JpaRepository<SnsImage, Integer> {

}
