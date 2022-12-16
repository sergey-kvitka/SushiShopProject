package com.kvitka.sushishop.controllers;

import com.kvitka.sushishop.entities.ExtraItem;
import com.kvitka.sushishop.entities.Food;
import com.kvitka.sushishop.entities.Ingredient;
import com.kvitka.sushishop.interfaces.CatalogItem;
import com.kvitka.sushishop.services.*;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("api/catalog")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CatalogController {

    private final FoodService foodService;
    private final ExtraItemService extraItemService;

    private final ItemService itemService;
    private final IngredientService ingredientService;
    private final CategoryService categoryService;

    public CatalogController(FoodService foodService, ItemService itemService, IngredientService ingredientService,
                             CategoryService categoryService, ExtraItemService extraItemService) {
        this.foodService = foodService;
        this.itemService = itemService;
        this.ingredientService = ingredientService;
        this.categoryService = categoryService;
        this.extraItemService = extraItemService;
    }

    @GetMapping("getAllCatalogItems")
    public List<CatalogItem> getAllCatalogItems() {
        List<CatalogItem> catalogItems = new ArrayList<>();
        catalogItems.addAll(foodService.getAllFood());
        catalogItems.addAll(extraItemService.getAllExtraItems());

        System.out.println(catalogItems);
        return catalogItems;
    }

    @PostMapping("saveFood")
    private void saveFood(@RequestBody Food food) {
        foodService.saveFood(food);
    }

    @PostMapping("saveExtraItem")
    private void saveExtraItem(@RequestBody ExtraItem extraItem) {
        extraItemService.saveExtraItem(extraItem);
    }

    @PostMapping("saveIngredients")
    private void saveIngredients(@RequestBody List<Ingredient> ingredients) {
        ingredientService.saveIngredients(ingredients);
    }

    @DeleteMapping("deleteFood")
    private void deleteFood(@RequestBody Food food) {
        foodService.deleteFood(food);
    }

    @DeleteMapping("deleteExtraItem")
    private void deleteExtraItem(@RequestBody ExtraItem extraItem) {
        extraItemService.deleteExtraItem(extraItem);
    }

    @DeleteMapping("deleteIngredients")
    private void deleteIngredients(@RequestBody List<Ingredient> ingredients) {
        ingredientService.deleteIngredients(ingredients);
    }
}
