/**
 * @author wheesunglee
 * @create date 2023-09-19 08:20:08
 * @modify date 2023-09-19 08:20:08
 */
package com.newus.traders.product.repository;

import java.util.List;
import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.newus.traders.product.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p.likes FROM Product p WHERE p.id = :id")
    Long findLikesByProductId(@Param("id") Long id);

    List<Product> findByIsDeletedFalse();

    @Query("SELECT p FROM Product p WHERE p.id = :id AND p.isDeleted = false")
    Optional<Product> findByIdAndIsDeletedFalse(@Param("id") Long id);

    /**
    * @author jeongyeatim
    * @create date 2023-09-19 08:20:08
    * @modify date 2023-09-19 08:20:08
    * @desc [현재 위치 장소(위도,경도)에서 입력한 반경(3km) 안의 장소(위도,경도)들을 리스트에 넣어준다.]
    */
    @Query(value = "SELECT DISTINCT p.* " +
        "FROM product p " +
        "WHERE (6371 * acos(cos(:latitude * (3.141592653589793 / 180)) * cos(p.latitude * (3.141592653589793 / 180)) * cos((:longitude * (3.141592653589793 / 180)) - (p.longitude * (3.141592653589793 / 180))) + sin(:latitude * (3.141592653589793 / 180)) * sin(p.latitude * (3.141592653589793 / 180)))) <= :distance " +
        "ORDER BY (6371 * acos(cos(:latitude * (3.141592653589793 / 180)) * cos(p.latitude * (3.141592653589793 / 180)) * cos((:longitude * (3.141592653589793 / 180)) - (p.longitude * (3.141592653589793 / 180))) + sin(:latitude * (3.141592653589793 / 180)) * sin(p.latitude * (3.141592653589793 / 180)))) ASC",
        nativeQuery = true)
    List<Product> findByDistance(@Param("latitude") double latitude,
                             @Param("longitude") double longitude,
                             @Param("distance") double distance);

}