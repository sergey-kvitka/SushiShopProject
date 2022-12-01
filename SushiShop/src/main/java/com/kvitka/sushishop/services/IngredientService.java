package com.kvitka.sushishop.services;

import com.kvitka.sushishop.entities.Ingredient;
import com.kvitka.sushishop.interfaces.SaveOrGetMethod;
import com.kvitka.sushishop.repositories.IngredientRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class IngredientService implements SaveOrGetMethod<Ingredient> {

    private final IngredientRepository ingredientRepository;

    public IngredientService(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    @Override
    public Ingredient saveOrGet(Ingredient ingredient) {
        return ingredientRepository.findByName(ingredient.getName())
                .orElseGet(() -> ingredientRepository.save(ingredient));
    }
}
