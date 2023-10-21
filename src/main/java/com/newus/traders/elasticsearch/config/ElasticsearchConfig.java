// /**
//  * @author wheesunglee
//  * @create date 2023-09-27 11:00:15
//  * @modify date 2023-09-29 23:21:39
//  */

// package com.newus.traders.elasticsearch.config;

// import java.util.ArrayList;
// import java.util.List;

// import org.apache.http.Header;
// import org.apache.http.HttpHost;
// import org.apache.http.auth.AuthScope;
// import org.apache.http.auth.UsernamePasswordCredentials;
// import org.apache.http.client.CredentialsProvider;
// import org.apache.http.impl.client.BasicCredentialsProvider;
// import org.apache.http.impl.nio.client.HttpAsyncClientBuilder;
// import org.apache.http.message.BasicHeader;
// import org.elasticsearch.client.RestClient;
// import org.elasticsearch.client.RestClientBuilder;
// import org.elasticsearch.client.RestHighLevelClient;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.data.elasticsearch.config.AbstractElasticsearchConfiguration;
// import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
// import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
// import org.springframework.data.elasticsearch.core.convert.ElasticsearchConverter;
// import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
// import org.springframework.http.HttpHeaders;

// @Configuration
// @EnableElasticsearchRepositories(basePackages = "com.newus.traders.elasticsearch")
// public class ElasticsearchConfig extends AbstractElasticsearchConfiguration {

//     @Value("${elasticsearch.username}")
//     String user;

//     @Value("${elasticsearch.password}")
//     String password;

//     @Value("${elasticsearch.host}")
//     String host;

//     @Value("${elasticsearch.port}")
//     int port;

//     @Override
//     public RestHighLevelClient elasticsearchClient() {

//         CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
//         credentialsProvider.setCredentials(AuthScope.ANY,
//                 new UsernamePasswordCredentials(user, password));

//         HttpHost httpHost = new HttpHost(host, port, "http");

//         RestClientBuilder builder = RestClient.builder(httpHost)
//                 .setHttpClientConfigCallback(new RestClientBuilder.HttpClientConfigCallback() {
//                     @Override
//                     public HttpAsyncClientBuilder customizeHttpClient(
//                             HttpAsyncClientBuilder httpClientBuilder) {
//                         return httpClientBuilder
//                                 .setDefaultCredentialsProvider(credentialsProvider)
//                                 .setDefaultHeaders(compatibilityHeaders())

//                 ;
//                     }
//                 });

//         return new RestHighLevelClient(builder);
//     }

//     private List<Header> compatibilityHeaders() {
//         List<Header> headers = new ArrayList<>();
//         headers.add(new BasicHeader(HttpHeaders.ACCEPT, "application/vnd.elasticsearch+json;compatible-with=7"));
//         headers.add(new BasicHeader(HttpHeaders.CONTENT_TYPE, "application/vnd.elasticsearch+json;compatible-with=7"));
//         return headers;
//     }

//     @Override
//     public ElasticsearchOperations elasticsearchOperations(ElasticsearchConverter elasticsearchConverter,
//             RestHighLevelClient elasticsearchClient) {
//         return new ElasticsearchRestTemplate(elasticsearchClient());
//     }

// }