/**
 * @author wheesunglee
 * @create date 2023-10-04 16:10:26
 * @modify date 2023-10-11 15:31:55
 */
package com.newus.traders.redis.service;

import java.time.LocalDate;
import java.util.Iterator;
import java.util.Set;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.newus.traders.exception.CustomException;
import com.newus.traders.exception.ErrorCode;
import com.newus.traders.product.entity.Product;
import com.newus.traders.product.repository.ProductRepository;
import com.newus.traders.user.entity.User;
import com.newus.traders.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final RedisTemplate<String, String> redisTemplate;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    public ValueOperations<String, String> operationsForValue() {
        return redisTemplate.opsForValue();
    }

    public void deleteKey(String key) {
        redisTemplate.delete(key);
    }

    public void addLikes(Long productId, String username) {
        User user = getUser(username);

        String productKey = "productId:" + productId;

        if (!checkIfLiked(productId, username)) {
            operationsForValue().setBit(productKey, user.getUserId(), true);
        }
    }

    public void removeLikes(Long productId, String username) {
        User user = getUser(username);
        String productKey = "productId:" + productId;

        operationsForValue().setBit(productKey, user.getUserId(), false);
    }

    public boolean checkIfLiked(Long productId, String username) {
        User user = getUser(username);

        String productKey = "productId:" + productId;

        return operationsForValue().getBit(productKey, user.getUserId());
    }

    public Object countLikes(Long productId) {

        String productKey = "productId:" + productId;

        Object objectCount = redisTemplate.execute(connection -> {
            return connection.bitCount(productKey.getBytes());
        }, true);
        // return (Long) redisTemplate.execute(connection ->

        // {
        // return connection.bitCount(productKey.getBytes());
        // }, true);
        return objectCount;
    }

    public void updateAttendance(LocalDate currentDate, String username) {
        User user = getUser(username);

        String dateKey = currentDate.toString();

        operationsForValue().setBit(dateKey, user.getUserId(), true);
    }

    public boolean checkAttendance(LocalDate currentDate, String username) {
        User user = getUser(username);

        String dateKey = currentDate.toString();

        return operationsForValue().getBit(dateKey, user.getUserId());
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void updateLikesInDB() {

        Set<String> productKeySet = redisTemplate.keys("productId*");
        Iterator<String> it = productKeySet.iterator();
        while (it.hasNext()) {

            String productKey = it.next();
            Long productId = Long.parseLong(productKey.split(":")[1]);

            if (countLikes(productId) != null) {

                Product product = productRepository.findById(productId)
                        .orElseThrow(() -> new CustomException(ErrorCode.PRODUCT_NOT_FOUND));

                if (product == null) {
                    throw new CustomException(ErrorCode.PRODUCT_NOT_FOUND);
                }

                product.setLikes((Long) countLikes(productId));

                productRepository.save(product);
            }

        }
        System.out.println("views update complete");

    }

}
