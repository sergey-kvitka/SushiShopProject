package com.kvitka.sushishop.services;

import com.kvitka.sushishop.entities.Item;
import com.kvitka.sushishop.repositories.ItemRepository;
import org.springframework.stereotype.Service;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final CategoryService categoryService;

    public ItemService(ItemRepository itemRepository, CategoryService categoryService) {
        this.itemRepository = itemRepository;
        this.categoryService = categoryService;
    }

    public Item saveItem(Item item) {
        item.setCategory(categoryService.saveCategory(item.getCategory()));
        return itemRepository.save(item);
    }

    public void deleteItemByName(String name) {
        itemRepository.deleteByName(name);
    }
}
