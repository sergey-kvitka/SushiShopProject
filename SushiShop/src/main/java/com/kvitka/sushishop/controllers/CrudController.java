package com.kvitka.sushishop.controllers;

import com.kvitka.sushishop.services.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/crud/")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CrudController {
    private final FoodService foodService;
    private final ExtraItemService extraItemService;

    private final ItemService itemService;
    private final IngredientService ingredientService;
    private final CategoryService categoryService;

    public CrudController(FoodService foodService, ItemService itemService, IngredientService ingredientService,
                             CategoryService categoryService, ExtraItemService extraItemService) {
        this.foodService = foodService;
        this.itemService = itemService;
        this.ingredientService = ingredientService;
        this.categoryService = categoryService;
        this.extraItemService = extraItemService;
    }



}
