package com.kvitka.sushishop.services;

import com.kvitka.sushishop.entities.Ingredient;
import com.kvitka.sushishop.repositories.IngredientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IngredientService {

    private final IngredientRepository ingredientRepository;

    public IngredientService(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    public Iterable<Ingredient> saveIngredients(Iterable<Ingredient> ingredients) {
        return ingredientRepository.saveAll(ingredients);
    }

    public void deleteIngredients(Iterable<Ingredient> ingredients) {
        ingredientRepository.deleteAll(ingredients);
    }
}
