package com.kvitka.sushishop.services;

import com.kvitka.sushishop.entities.Food;
import com.kvitka.sushishop.entities.Ingredient;
import com.kvitka.sushishop.repositories.FoodRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodService {

    private final FoodRepository foodRepository;
    private final IngredientService ingredientService;
    private final ItemService itemService;

    public FoodService(FoodRepository foodRepository,
                       IngredientService ingredientService,
                       ItemService itemService) {
        this.foodRepository = foodRepository;
        this.ingredientService = ingredientService;
        this.itemService = itemService;
    }

    public List<Food> getAllFood() {
        return foodRepository.findAll();
    }

    public Food saveFood(Food food) {
        food.setIngredients((List<Ingredient>) ingredientService.saveIngredients(food.getIngredients()));
        food.setItem(itemService.saveItem(food.getItem()));
        return foodRepository.save(food);
    }

    public void deleteFoodById(Long id) {
        itemService.deleteItemById(id);
    }

    public Food getFoodById(Long id) {
        return foodRepository.findById(id).orElse(null);
    }
}
