/**
 * @author wheesunglee
 * @create date 2023-09-19 08:18:21
 * @modify date 2023-10-11 16:47:48
 */
package com.newus.traders.product.controller;

import com.newus.traders.product.dto.ProductDto;
import com.newus.traders.product.form.ProductForm;
import com.newus.traders.product.service.ProductService;
import com.newus.traders.user.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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
    public ResponseEntity<List<ProductDto>> getAllProducts(@RequestHeader("token") String accessToken) {

        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("mypage/products")
    public ResponseEntity<List<ProductDto>> getMyProducts(@RequestHeader("token") String accessToken) {

        return ResponseEntity.ok(productService.getMyProducts(getUserDetails(accessToken)));
    }


    @GetMapping("/products/{id}")
    public ResponseEntity<ProductDto> getProduct(@PathVariable("id") Long id) {

        return ResponseEntity.ok(productService.getProduct(id));
    }


    @PostMapping("/products/register")
    public ResponseEntity<String> registerProduct(@RequestHeader("token") String accessToken,
                                                  @RequestPart("data") ProductForm productForm,
                                                  @RequestPart("files") List<MultipartFile> files) {
        System.out.println(":::::::::::::::::::" + accessToken);
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


    /**
     * @author jeongyearim
     * @create date 2023-09-26 13:41:14
     * @modify date 2023-09-26 13:41:14
     */
    @GetMapping("/products/nearestProducts")
    public ResponseEntity<List<ProductDto>> getNearestProducts(@RequestParam("latitude") double latitude,
                                                               @RequestParam("longitude") double longitude) {

        return ResponseEntity.ok(productService.getNearestProducts(latitude, longitude));
    }

}