/**
 * @author jeongyearim
 * @create date 2023-10-12 16:40:46
 * @modify date 2023-10-12 16:40:46
 */
package com.newus.traders.sns.form;
import javax.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SnsForm {

    private String content; // 포스팅 내용

    @NotBlank
    private String tags; // 태그
}
