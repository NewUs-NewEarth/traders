/**
 * @author jeongyearim
 * @create date 2023-10-06 15:32:11
 * @modify date 2023-10-06 15:32:11
 */
package com.newus.traders.sns.entity;

import java.sql.Timestamp;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.newus.traders.sns.form.SnsForm;
import com.newus.traders.user.entity.User;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

//import com.newus.traders.model.entity.User;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Sns {
	
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String content; // 포스팅 내용

    @CreationTimestamp
    private Timestamp  createdDate;

    @UpdateTimestamp
    private Timestamp updatedAt;

    @OneToMany(mappedBy = "sns", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<SnsImage> images;

    private String tags; // 태그

    @ManyToOne
	private User author; // 포스팅을 한 사용자

    // @ManyToMany  //Set은 컬렉션으로 중복 허용 안함
 	// Set<User> like;

    @Builder
    public Sns(User author,SnsForm snsForm) {
        this.content = snsForm.getContent();
        this.tags = snsForm.getTags();
        this.author = author;  
    }  
}