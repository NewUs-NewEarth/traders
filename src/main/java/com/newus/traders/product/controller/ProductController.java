/**
 * @author wheesunglee
 * @create date 2023-09-19 08:18:21
 * @modify date 2023-10-11 16:47:48
 */
package com.newus.traders.product.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.newus.traders.product.dto.ProductDto;
import com.newus.traders.product.form.ProductForm;
import com.newus.traders.product.service.ProductService;
import com.newus.traders.user.jwt.TokenProvider;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ProductController {

    private final ProductService productService;
    private final TokenProvider tokenProvider;

    public String getUserDetails(String accessToken) {
        Authentication authentication = tokenProvider.getAuthentication(accessToken);
        Object principal = authentication.getPrincipal();
        UserDetails userDetails = (UserDetails) principal;
        return userDetails.getUsername();
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> getAllProducts() {

        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ProductDto> getProduct(@PathVariable("id") Long id) {

        return ResponseEntity.ok(productService.getProduct(id));
    }

    // 나의 판매 상품 목록 보기 구현 필요//

    @PostMapping("/products/register")
    public ResponseEntity<String> registerProduct(@RequestHeader("token") String accessToken,
            @RequestPart("data") ProductForm productForm,
            @RequestPart("files") List<MultipartFile> files) {

        return ResponseEntity.ok(productService.registerProduct(getUserDetails(accessToken), productForm, files));
    }

    @PutMapping("/products/update/{id}")
    public ResponseEntity<String> updateProduct(@RequestHeader("token") String accessToken, @PathVariable("id") Long id,
            @RequestPart("data") ProductForm productForm,
            @RequestPart(value = "files", required = false) List<MultipartFile> newFiles,
            @RequestParam(value = "removedFiles", required = false) List<Integer> removedFiles) {

        return ResponseEntity
                .ok(productService.updateProduct(getUserDetails(accessToken), id, productForm, newFiles, removedFiles));
    }

    @DeleteMapping("/products/delete/{id}")
    public ResponseEntity<String> deleteProduct(@RequestHeader("token") String accessToken,
            @PathVariable("id") Long id) {

        return ResponseEntity.ok(productService.deleteProduct(getUserDetails(accessToken), id));
    }

    @PutMapping("/products/purchase/{id}")
    public ResponseEntity<String> purchaseProduct(@PathVariable("id") Long id) {

        return ResponseEntity.ok(productService.purchaseProduct(id));
    }

    /*
     * @author jeongyearim
     * 
     * @create date 2023-09-26 13:41:14
     * 
     * @modify date 2023-09-26 13:41:14
     * 
     * @desc [프론트단에서 받아온 위도,경도를 확인하고 3km 반경의 랜덤 생성 데이터를 db에 넣는다.]
     */

    @GetMapping("/products/nearestProducts")
    public ResponseEntity<List<ProductDto>> getNearestProducts(@RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude) {

        return ResponseEntity.ok(productService.getNearestProducts(latitude, longitude));
    }

}