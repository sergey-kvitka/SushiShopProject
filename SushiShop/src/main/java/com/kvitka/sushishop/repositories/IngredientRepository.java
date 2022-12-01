package com.kvitka.sushishop.repositories;

import com.kvitka.sushishop.entities.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    boolean existsByName(String name);
    Optional<Ingredient> findByName(String name);
}
