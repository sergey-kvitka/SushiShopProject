package com.kvitka.sushishop.controllers;

import com.kvitka.sushishop.dto.OrderDto;
import com.kvitka.sushishop.entities.*;
import com.kvitka.sushishop.interfaces.CatalogItem;
import com.kvitka.sushishop.services.*;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/catalog/")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CatalogController {

    private final FoodService foodService;
    private final ExtraItemService extraItemService;

    private final ItemService itemService;
    private final IngredientService ingredientService;
    private final CategoryService categoryService;
    private OrderService orderService;

    public CatalogController(FoodService foodService, ItemService itemService, IngredientService ingredientService,
                             CategoryService categoryService, ExtraItemService extraItemService,
                             OrderService orderService) {
        this.foodService = foodService;
        this.itemService = itemService;
        this.ingredientService = ingredientService;
        this.categoryService = categoryService;
        this.extraItemService = extraItemService;
        this.orderService = orderService;
    }

    @GetMapping("getAllCatalogItems")
    public List<CatalogItem> getAllCatalogItems() {
        List<CatalogItem> catalogItems = new ArrayList<>();
        catalogItems.addAll(foodService.getAllFood());
        catalogItems.addAll(extraItemService.getAllExtraItems());

        System.out.println(catalogItems);
        return catalogItems;
    }

    @PostMapping("test")
    public int a(@RequestBody int[] nums) {
        return Arrays.stream(nums).sum();
    }

    @GetMapping("getCatalogItemByName")
    public CatalogItem getCatalogItemByName(@RequestParam String name) {
        System.out.println("name: " + name);
        Item item = itemService.getItemByName(name.toLowerCase());
        System.out.println("item: " + item);
        if (item == null) {
            System.out.println("returning null...");
            return null;
        }
        String hyperCategory = item.getCategory().getHyperCategory();
        Long id = item.getId();
        if ("food".equalsIgnoreCase(hyperCategory)) {
            System.out.println("aaa");
            return foodService.getFoodById(id);
        } else if ("other".equalsIgnoreCase(hyperCategory)) {
            System.out.println("aaa2");
            return extraItemService.getExtraItemById(id);
        }
        return null;
    }

    @GetMapping("getCatalogItemById")
    public CatalogItem getCatalogItemById(@RequestParam Long id) {
        Item item = itemService.getItemById(id);
        if (item == null) return null;
        String hyperCategory = item.getCategory().getHyperCategory();
        if ("food".equalsIgnoreCase(hyperCategory)) {
            System.out.println("-aaa");
            return foodService.getFoodById(id);
        } else if ("other".equalsIgnoreCase(hyperCategory)) {
            System.out.println("-aaa2");
            return extraItemService.getExtraItemById(id);
        }
        return null;
    }

    @GetMapping("getCategories")
    public List<Category> getCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("getIngredients")
    public List<Ingredient> getIngredients() {
        return ingredientService.getAllIngredients();
    }

    @PostMapping("saveFood")
    public boolean saveFood(@RequestBody Food food) {
        System.out.println("hello");
        System.out.println(food);
        foodService.saveFood(food);
        return true;
    }

    @PostMapping("saveExtraItem")
    public boolean saveExtraItem(@RequestBody ExtraItem extraItem) {
        System.out.println(extraItem);
        extraItemService.saveExtraItem(extraItem);
        return true;
    }

    @PostMapping("deleteCatalogItem/{id}")
    public void deleteFood(@PathVariable Long id) {
        Item item = itemService.getItemById(id);
        if (item == null) return;
        String hyperCategory = item.getCategory().getHyperCategory();
        if ("food".equalsIgnoreCase(hyperCategory)) {
            foodService.deleteFoodById(id);
        } else if ("other".equalsIgnoreCase(hyperCategory)) {
            extraItemService.deleteExtraItemById(id);
        }
    }

    @PostMapping("saveIngredient")
    public void saveIngredients(@RequestBody Ingredient ingredient) {
        ingredientService.saveIngredient(ingredient);
    }

    @DeleteMapping("deleteIngredient/{id}")
    public void deleteIngredient(@PathVariable Long id) {
        ingredientService.deleteIngredientById(id);
    }

    @PostMapping("getListOfCatalogItemsByIds")
    public List<CatalogItem> getListOfCatalogItemsByIds(@RequestBody List<Long> ids) {
        Item item;
        List<CatalogItem> result = new ArrayList<>();
        for (Long id: ids) {
            item = itemService.getItemById(id);
            if (item == null) continue;
            String hyperCategory = item.getCategory().getHyperCategory();
            if ("food".equalsIgnoreCase(hyperCategory)) {
                result.add(foodService.getFoodById(id));
            }
            else if ("other".equalsIgnoreCase(hyperCategory)) {
                result.add(extraItemService.getExtraItemById(id));
            }
        }
        return result;
    }

    @GetMapping("getOrders")
    public List<OrderDto> getOrders() {
        return orderService.getOrders();
    }

    @GetMapping("getOrdersByUserId/{id}")
    public List<OrderDto> getOrdersByUserId(@PathVariable Long id) {
        return orderService.getOrdersByUserId(id);
    }

    @PostMapping("saveOrder")
    public void saveOrder(@RequestBody OrderDto orderDto) {
        orderDto.setDate(new Date());
        System.out.println(orderDto.toOrder());
        orderService.saveOrder(orderDto);
    }

    @DeleteMapping("deleteOrder/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }

    @PostMapping("saveCategory")
    public void saveCategory(@RequestBody Category category) {
        categoryService.saveCategory(category);
    }

    @DeleteMapping("deleteCategory/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
    }
}
