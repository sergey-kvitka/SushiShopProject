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

    public Item getItemByName(String name) {
        return itemRepository.findByName(name).orElse(null);
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id).orElse(null);
    }

    public void deleteItemById(Long id) {
        itemRepository.deleteById(id);
    }
}
