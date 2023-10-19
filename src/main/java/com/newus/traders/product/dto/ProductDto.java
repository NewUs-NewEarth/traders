/**
 * @author wheesunglee
 * @create date 2023-09-19 08:30:07
 * @modify date 2023-10-06 18:52:03
 */

package com.newus.traders.product.dto;

import java.time.LocalDate;
import java.util.List;

import com.newus.traders.product.entity.Image;
import com.newus.traders.product.entity.Product;
import com.newus.traders.product.type.ProductStatus;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductDto {

    private Long id;

    // 회원 entity와 연결
    // seller;

    private String seller;

    private String name;

    private Long price;

    private String description;

    private ProductStatus status;

    private double latitude;

    private double longitude;

    private String category;

    private LocalDate createdAt;

    private List<Image> images;

    private Long likes;

    private boolean liked;

    @Builder
    public ProductDto(Product product) {
        this.id = product.getId();
        this.seller = product.getSeller().getUsername();
        this.name = product.getName();
        this.price = product.getPrice();
        this.description = product.getDescription();
        this.status = product.getStatus();
        this.latitude = product.getLatitude();
        this.longitude = product.getLongitude();
        this.category = product.getCategory();
        this.createdAt = product.getCreatedAt().toLocalDateTime().toLocalDate();
        this.images = product.getImages();
        this.likes = product.getLikes();
    }

    public void setLikes(Long likes) {
        this.likes = likes;
    }

    public void setLiked(boolean liked) {
        this.liked = liked;
    }

}