package com.kvitka.sushishop.repositories;

import com.kvitka.sushishop.entities.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    void deleteByName(String name);
}
