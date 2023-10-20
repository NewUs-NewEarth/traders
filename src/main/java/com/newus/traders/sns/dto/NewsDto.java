/**
 * @author jeongyearim
 * @create date 2023-10-06 15:53:24
 * @modify date 2023-10-06 15:53:24
 */
package com.newus.traders.sns.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewsDto {
    private String imageUrl;
    private String articleTitle;
    private String summaryTitle;
    private String articleLink;
}
