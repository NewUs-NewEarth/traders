/**
 * @author heera youn
 * @create date 2023-10-16 11:31:03
 * @modify date 2023-10-16 11:31:03
 */
package com.newus.traders.user.repository;

import com.newus.traders.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 현재 Email이 LoginID
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);


}
