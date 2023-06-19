package com.kvitka.sushishop.services;

import com.kvitka.sushishop.entities.ExtraItem;
import com.kvitka.sushishop.repositories.ExtraItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExtraItemService {

    private final ExtraItemRepository extraItemRepository;
    private final ItemService itemService;

    public ExtraItemService(ExtraItemRepository extraItemRepository, ItemService itemService) {
        this.extraItemRepository = extraItemRepository;
        this.itemService = itemService;
    }

    public List<ExtraItem> getAllExtraItems() {
        return extraItemRepository.findAll();
    }

    public ExtraItem saveExtraItem(ExtraItem extraItem) {
        extraItem.setItem(itemService.saveItem(extraItem.getItem()));
        return extraItemRepository.save(extraItem);
    }

    public ExtraItem getExtraItemById(Long id) {
        return extraItemRepository.findById(id).orElse(null);
    }

    public void deleteExtraItemById(Long id) {
        itemService.deleteItemById(id);
    }
}
