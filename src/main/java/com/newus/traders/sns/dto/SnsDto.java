/**
 * @author jeongyearim
 * @create date 2023-10-12 16:40:28
 * @modify date 2023-10-12 16:40:28
 */
package com.newus.traders.sns.dto;

import java.sql.Timestamp;
import java.util.List;

import com.newus.traders.sns.entity.Sns;
import com.newus.traders.sns.entity.SnsImage;
import com.newus.traders.user.entity.User;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SnsDto {
   
    private Long id;

    private String content; // 포스팅 내용

    private Timestamp createdDate;

    private Timestamp updatedAt;

    private List<SnsImage> images;

    private String tags; // 태그

	private User author; // 포스팅을 한 사용자

    // @ManyToMany  //Set은 컬렉션으로 중복 허용 안함
 	// Set<User> like;

    @Builder
    public SnsDto(Sns sns) {
        this.id = sns.getId();
        this.content = sns.getContent();
        this.tags = sns.getTags(); 
        this.createdDate = sns.getCreatedDate();
        this.updatedAt = sns.getUpdatedAt();
        this.images = sns.getImages();
        this.author = sns.getAuthor();
    }   
}
