package com.kvitka.sushishop.repositories;

import com.kvitka.sushishop.entities.Food;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodRepository extends JpaRepository<Food, Long> {
}
