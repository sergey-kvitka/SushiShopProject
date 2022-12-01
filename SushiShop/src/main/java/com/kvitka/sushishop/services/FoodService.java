package com.kvitka.sushishop.services;

import com.kvitka.sushishop.entities.Food;
import com.kvitka.sushishop.entities.Item;
import com.kvitka.sushishop.repositories.FoodRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodService {

    private final FoodRepository foodRepository;
    private final IngredientService ingredientService;
    private final CategoryService categoryService;
    private final ItemService itemService;

    public FoodService(FoodRepository foodRepository,
                       IngredientService ingredientService,
                       CategoryService categoryService,
                       ItemService itemService) {
        this.foodRepository = foodRepository;
        this.ingredientService = ingredientService;
        this.categoryService = categoryService;
        this.itemService = itemService;
    }

    public Food saveFood(Food food) {
        food.setIngredients(food.getIngredients().stream()
                .map(ingredientService::saveOrGet)
                .collect(Collectors.toList()));
        Item item = food.getItem();
        item.setCategory(categoryService.saveOrGet(item.getCategory()));
        food.setItem(itemService.saveOrGet(item));

        return foodRepository.save(food);
    }

    public List<Food> getAll() {
        return foodRepository.findAll();
    }
}
