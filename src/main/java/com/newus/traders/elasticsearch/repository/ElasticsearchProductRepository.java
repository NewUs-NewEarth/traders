// /**
//  * @author wheesunglee
//  * @create date 2023-09-27 11:08:20
//  * @modify date 2023-09-27 11:08:20
//  */

// package com.newus.traders.elasticsearch.repository;

// import java.util.List;

// import org.springframework.data.elasticsearch.annotations.Query;
// import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

// import com.newus.traders.elasticsearch.document.ProductDocument;

// public interface ElasticsearchProductRepository extends ElasticsearchRepository<ProductDocument, Long> {
//     // @Query("{\"match\": {\"name.nori\": \"?0\"}}")
//     // List<ProductDocument> findByName(String keyword);
//     @Query("{\"bool\": {\"must\": [{\"match\": {\"name.nori\": \"?0\"}},{\"term\": {\"is_deleted\": 0}}]}}")
//     List<ProductDocument> findByName(String keyword);

// }
