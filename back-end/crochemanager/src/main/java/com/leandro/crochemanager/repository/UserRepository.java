package com.leandro.crochemanager.repository;

import com.leandro.crochemanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
