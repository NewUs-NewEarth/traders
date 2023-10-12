/**
 * @author wheesunglee
 * @create date 2023-09-19 08:18:21
 * @modify date 2023-10-11 16:47:48
 */
package com.newus.traders.product.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.newus.traders.product.dto.ProductDto;
import com.newus.traders.product.form.ProductForm;
import com.newus.traders.product.service.ProductService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ProductController {

    private final ProductService productService;

    /*
     * Response Entity
     * - 여태까지 했던 반환은 응답의 body부분에만 데이터를 넣는 것,
     * - Response Entity를 사용해서 상태코드(404, 200, 500)과 컨텐츠 유형(json, text/html) 등이 있는 헤더
     * 정보와 body를 같이 보낼 수 있음
     * 
     * 
     * 1. 컨트롤러에서 반환 타입을 ResponseEntity로 한번 더 묶어주기
     * 예) List를 반환하면 ResponseEntity<List<Object>>
     * 
     * 2. return 후 ResponseEntity.ok(반환값)
     * -여기서 ok는 200 상태 코드
     * 
     */

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
    public ResponseEntity<String> registerProduct(@RequestPart("data") ProductForm productForm,
            @RequestPart("files") List<MultipartFile> files) {

        return ResponseEntity.ok(productService.registerProduct(productForm, files));
    }

    @PutMapping("/products/update/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable("id") Long id,
            @RequestPart("data") ProductForm productForm,
            @RequestPart("files") List<MultipartFile> newFiles,
            @RequestParam("removedFiles") List<Integer> removedFiles) {

        return ResponseEntity.ok(productService.updateProduct(id, productForm, newFiles, removedFiles));
    }

    @DeleteMapping("/products/delete/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") Long id) {

        return ResponseEntity.ok(productService.deleteProduct(id));
    }

    @PutMapping("/products/purchase/{id}")
    public ResponseEntity<String> purchaseProduct(@PathVariable("id") Long id) {

        return ResponseEntity.ok(productService.purchaseProduct(id));
    }

    
    /* @author jeongyearim
    * @create date 2023-09-26 13:41:14
    * @modify date 2023-09-26 13:41:14
    * @desc [프론트단에서 받아온 위도,경도를 확인하고 3km 반경의 랜덤 생성 데이터를 db에 넣는다.]
    */


   /////////////////////
    @GetMapping("/products/nearestProducts")
    public ResponseEntity<List<ProductDto>> getNearestProducts(@RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude) {

        //System.out.println("받은 위도: " + latitude);
        //System.out.println("받은 경도: " + longitude);

        return ResponseEntity.ok(productService.getNearestProducts(latitude, longitude));
    }

    /* 
    @PostMapping("/products/nearestProducts")
    public ResponseEntity<List<Product>> receiveCoordinates(@RequestBody Coordinates coordinates) {
        double latitude = coordinates.getLatitude();
        double longitude = coordinates.getLongitude();

        // 여기에서 위도와 경도 데이터를 활용하여 원하는 작업을 수행합니다.
        System.out.println("받은 위도: " + latitude);
        System.out.println("받은 경도: " + longitude);

        //3km 반경의 10개 무작위 상품 데이터 생성
        //productService.generateRandomProducts(35.438663933103975, 128.82745361768966, 10, 10);

        //3km 반경의 상품들을 오라클 db에서 가져온다.
        List<Product> products = productService.findProductsWithin3Km(latitude, longitude);

        return ResponseEntity.ok(products);
    }
    */
    
    
}