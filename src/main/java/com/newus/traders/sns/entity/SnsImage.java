/**
 * @author jeongyearim
 * @create date 2023-10-12 16:40:41
 * @modify date 2023-10-12 16:40:41
 */
package com.newus.traders.sns.entity;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.newus.traders.product.entity.Product;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SnsImage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne
    @JsonBackReference
    private Sns sns;

    // @OneToOne
    // @JsonBackReference
    // private UserEntity user;

    String filename;

    String filepath;

    @Builder
    public SnsImage(String filename) {

        this.filename = filename;
        this.filepath = "/files/" + filename;
    }

    public void setSns(Sns sns) {

        this.sns = sns;
    }
}
