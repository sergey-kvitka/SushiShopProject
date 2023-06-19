package com.kvitka.sushishop.services;

import com.kvitka.sushishop.entities.Ingredient;
import com.kvitka.sushishop.repositories.IngredientRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class IngredientService {

    private final IngredientRepository ingredientRepository;

    public IngredientService(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    public Iterable<Ingredient> saveIngredients(Iterable<Ingredient> ingredients) {
        List<Ingredient> newIngredients = new ArrayList<>();
        for (Ingredient ingredient : ingredients) {
            System.out.println(ingredient);
            newIngredients.add(ingredientRepository.save(ingredient));
        }
        return newIngredients;
    }

    public void deleteIngredients(Iterable<Ingredient> ingredients) {
        ingredientRepository.deleteAll(ingredients);
    }

    public void deleteIngredientById(Long id) {
        ingredientRepository.deleteById(id);
    }

    public void saveIngredient(Ingredient ingredient) {
        ingredientRepository.save(ingredient);
    }
}
