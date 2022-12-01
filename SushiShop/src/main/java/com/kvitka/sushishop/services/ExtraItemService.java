package com.kvitka.sushishop.services;

import com.kvitka.sushishop.entities.ExtraItem;
import com.kvitka.sushishop.entities.Item;
import com.kvitka.sushishop.interfaces.CatalogItem;
import com.kvitka.sushishop.repositories.ExtraItemRepository;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
public class ExtraItemService {

    private final ExtraItemRepository extraItemRepository;
    private final CategoryService categoryService;
    private final ItemService itemService;

    public ExtraItemService(ExtraItemRepository extraItemRepository,
                            CategoryService categoryService,
                            ItemService itemService) {
        this.extraItemRepository = extraItemRepository;
        this.categoryService = categoryService;
        this.itemService = itemService;
    }

    public ExtraItem saveExtraItem(ExtraItem extraItem) {
        Item item = extraItem.getItem();
        item.setCategory(categoryService.saveOrGet(item.getCategory()));
        extraItem.setItem(itemService.saveOrGet(item));

        return extraItemRepository.save(extraItem);
    }

    public List<ExtraItem> getAll() {
        return extraItemRepository.findAll();
    }
}
