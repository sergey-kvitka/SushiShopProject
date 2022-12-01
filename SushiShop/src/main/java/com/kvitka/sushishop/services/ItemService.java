package com.kvitka.sushishop.services;

import com.kvitka.sushishop.entities.Item;
import com.kvitka.sushishop.interfaces.SaveOrGetMethod;
import com.kvitka.sushishop.repositories.ItemRepository;
import org.springframework.stereotype.Service;

@Service
public class ItemService implements SaveOrGetMethod<Item> {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public Item saveItem(Item item) {
        return itemRepository.save(item);
    }

    @Override
    public Item saveOrGet(Item entity) {
        return itemRepository.findByName(entity.getName())
                .orElseGet(() -> itemRepository.save(entity));
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id).orElse(null);
    }
}
