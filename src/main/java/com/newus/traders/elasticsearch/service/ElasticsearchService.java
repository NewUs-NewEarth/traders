// /**
//  * @author wheesunglee
//  * @create date 2023-09-27 11:00:20
//  * @modify date 2023-10-12 14:09:55
//  */

// package com.newus.traders.elasticsearch.service;

// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
// import java.util.function.Function;
// import java.util.stream.Collectors;

// import org.springframework.stereotype.Service;

// import com.newus.traders.elasticsearch.document.ProductDocument;
// import com.newus.traders.elasticsearch.repository.ElasticsearchProductRepository;
// import com.newus.traders.product.dto.ProductDto;
// import com.newus.traders.product.service.ProductService;

// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class ElasticsearchService {

//     private final ElasticsearchProductRepository elasticsearchProductRepository;
//     private final ProductService productService;

//     public Map<String, List<?>> getSearchResults(String keyword) {

//         Map<String, List<?>> searchResults = new HashMap<>();

//         List<ProductDocument> productDocumentList = elasticsearchProductRepository.findByName(keyword);
//         List<Long> productIdList = getIdList(productDocumentList, document -> document.getId());
//         List<ProductDto> productDtoList = productService.getSearchedProducts(productIdList);

//         searchResults.put("product", productDtoList);

//         return searchResults;
//     }

//     public <T, Long> List<Long> getIdList(List<T> documentList, Function<T, Long> mapper) {
//         List<Long> idList = documentList.stream()
//                 .map(mapper)
//                 .collect(Collectors.toList());
//         return idList;
//     }

// }
