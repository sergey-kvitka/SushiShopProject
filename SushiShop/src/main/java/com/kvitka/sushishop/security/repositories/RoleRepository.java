package com.kvitka.sushishop.security.repositories;

import com.kvitka.sushishop.security.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
}
