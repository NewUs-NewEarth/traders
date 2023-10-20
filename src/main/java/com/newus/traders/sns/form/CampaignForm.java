/**
 * @author jeongyearim
 * @create date 2023-10-16 09:35:19
 * @modify date 2023-10-16 09:35:19
 */
package com.newus.traders.sns.form;
import java.util.Date;

import javax.validation.constraints.NotBlank;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;



@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CampaignForm {

    private Date dueDate;
    private String organizer;
    private String title;

    
    private String description;  // 챌린지 의의

    
    private String verificationMethod;  // 인증 방법

    @NotBlank
    private String tags; // 태그
}
