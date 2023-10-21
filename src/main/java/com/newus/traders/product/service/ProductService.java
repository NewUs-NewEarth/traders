/**
 * @author wheesunglee
 * @create date 2023-09-19 08:19:20
 * @modify date 2023-10-12 15:32:31
 */
package com.newus.traders.product.service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.newus.traders.exception.CustomException;
import com.newus.traders.exception.ErrorCode;
import com.newus.traders.product.dto.ProductDto;
import com.newus.traders.product.entity.Image;
import com.newus.traders.product.entity.Product;
import com.newus.traders.product.form.ProductForm;
import com.newus.traders.product.repository.ImageRepository;
import com.newus.traders.product.repository.ProductRepository;
import com.newus.traders.product.type.ProductStatus;
import com.newus.traders.redis.service.RedisService;
import com.newus.traders.user.entity.User;
import com.newus.traders.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ImageRepository imageRepository;
    private final UserRepository userRepository;
    private final RedisService redisService;

    public User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    public List<ProductDto> getAllProducts() {

        List<Product> productList = productRepository.findAll();

        if (productList.size() == 0) {
            throw new CustomException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        List<ProductDto> productDtoList = new ArrayList<>();
        for (Product product : productList) {

            ProductDto productDto = new ProductDto(product);

            //productDto.setLiked(redisService.checkIfLiked(product.getId(),user.getUsername()));

            Object objectCount = redisService.countLikes(product.getId());

            if (objectCount != null) {
                productDto.setLikes((Long) objectCount);
            }

            productDtoList.add(productDto);
        }

        return productDtoList;
    }

    public List<ProductDto> getMyProducts(String username) {
        User user = getUser(username);

        List<Product> productList = productRepository.findBySeller(user);

        if (productList.size() == 0) {
            throw new CustomException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        List<ProductDto> productDtoList = new ArrayList<>();
        for (Product product : productList) {

            ProductDto productDto = new ProductDto(product);

            Object objectCount = redisService.countLikes(product.getId());

            if (objectCount != null) {
                productDto.setLikes((Long) objectCount);
            }

            productDtoList.add(productDto);
        }

        return productDtoList;
    }

    public ProductDto getProduct(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));

        ProductDto productDto = new ProductDto(product);

        // productDto.setLiked(redisService.checkIfLiked(product.getId(),
        // user.getUserId()));

        // Object objectCount = redisService.countLikes(product.getId());

        // if (objectCount != null) {
        // productDto.setLikes((Long) objectCount);
        // }
        return productDto;
    }

    public List<ProductDto> getSearchedProducts(List<Long> productIdList) {

        return productIdList.stream().map(id -> (getProduct(id)))
                .collect(Collectors.toList());
    }

    public void saveImage(List<MultipartFile> files, Product product) throws Exception {

        String projectPath = System.getProperty("user.dir") + "/src/main/resources/static/files";

        for (MultipartFile file : files) {

            UUID uuid = UUID.randomUUID();
            String filename = uuid + "_" + file.getOriginalFilename();

            File savedFile = new File(projectPath, filename);
            file.transferTo(savedFile);

            Image image = new Image(filename);
            image.setProduct(product);

            imageRepository.save(image);
        }
    }

    public void deleteImage(List<Integer> removedFiles) throws Exception {

        String projectPath = System.getProperty("user.dir") + "/src/main/resources/static/files";

        for (Integer id : removedFiles) {
            Optional<Image> imageOptional = imageRepository.findById(id);
            if (imageOptional.isPresent()) {
                Image image = imageOptional.get();
                String filename = image.getFilename();

                File fileToDelete = new File(projectPath, filename);
                if (fileToDelete.exists()) {
                    if (fileToDelete.delete()) {
                        imageRepository.delete(image);
                    } else {
                        throw new Exception("파일을 삭제하지 못했습니다.");
                    }
                } else {
                    throw new Exception("파일을 찾을 수 없습니다.");
                }
            } else {
                throw new Exception("해당 이미지를 찾을 수 없습니다.");
            }
        }
    }

    @Transactional
    public String registerProduct(String username, ProductForm productForm, List<MultipartFile> files) {

        User user = getUser(username);

        Product product = new Product(user, productForm);

        productRepository.save(product);

        try {

            saveImage(files, product);

        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            throw new CustomException(ErrorCode.PRODUCT_NOT_SAVED);
        }

        return "물품 등록을 완료하였습니다.";
    }

    @Transactional
    public String updateProduct(String username, Long productId, ProductForm productForm,
                                List<MultipartFile> newFiles, List<Integer> removedFiles) {

        User user = getUser(username);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));

        if (user != product.getSeller() || !product.getStatus().equals(ProductStatus.AVAILABLE)) {

            throw new CustomException(ErrorCode.PRODUCT_NOT_UPDATED);
        }

        product.updateProduct(productForm);

        productRepository.save(product);

        try {
            if (newFiles.size() != 0) {
                System.out.println("saveImage시작");
                saveImage(newFiles, product);
            }

            if (removedFiles.size() != 0) {
                System.out.println("deleteImage시작");

                deleteImage(removedFiles);
            }

        } catch (Exception exception) {
            System.out.println(exception.getMessage());
            throw new CustomException(ErrorCode.PRODUCT_NOT_UPDATED);
        }

        return "물품 수정을 완료하였습니다.";
    }

    public String deleteProduct(String username, Long productId) {

        User user = getUser(username);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));

        if (user != product.getSeller()) {
            throw new CustomException(ErrorCode.PRODUCT_NOT_DELETED);
        }

        productRepository.deleteById(product.getId());

        List<Integer> imagesToDelete = product.getImages().stream()
                .map(image -> image.getId())
                .collect(Collectors.toList());

        try {
            deleteImage(imagesToDelete);

        } catch (Exception exception) {
            System.out.println(exception.getMessage());

            throw new CustomException(ErrorCode.PRODUCT_NOT_DELETED);
        }

        return "물품 삭제를 완료하였습니다.";
    }

    public String purchaseProduct(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));

        if (product == null) {
            throw new CustomException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        product.purchaseProduct();

        productRepository.save(product);

        return "물품이 판매되었습니다.";
    }

    /**
     * @author jeongyearim
     * @create date 2023-09-26 17:33:07
     * @modify date 2023-09-26 17:33:07
     * @desc [주어진 중심 위도와 경도를 기준으로 3km 반경 내의 상품 리스트를 뽑아옵니다.]
     */
    public List<ProductDto> getNearestProducts(double latitude, double longitude) {
        // 3km 반경
        double distance = 3.0;

        List<Product> nearestProductList = productRepository.findByDistance(latitude, longitude, distance);

        if (nearestProductList.size() == 0) {
            throw new CustomException(ErrorCode.PRODUCT_NOT_FOUND);
        }

        List<ProductDto> nearestProductDtoList = new ArrayList<>();

        for (Product product : nearestProductList) {

            ProductDto productDto = new ProductDto(product);

            // productDto.setLiked(redisService.checkIfLiked(product.getId(),
            // user.getUserId));

            Object objectCount = redisService.countLikes(product.getId());

            if (objectCount != null) {
                productDto.setLikes((Long) objectCount);
            }

            nearestProductDtoList.add(productDto);
        }

        return nearestProductDtoList;
    }

}
