package com.kvitka.sushishop.repositories;

import com.kvitka.sushishop.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
