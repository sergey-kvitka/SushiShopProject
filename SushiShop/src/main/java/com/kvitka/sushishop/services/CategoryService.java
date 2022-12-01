package com.kvitka.sushishop.services;

import com.kvitka.sushishop.entities.Category;
import com.kvitka.sushishop.interfaces.SaveOrGetMethod;
import com.kvitka.sushishop.repositories.CategoryRepository;
import org.springframework.stereotype.Service;

@Service
public class CategoryService implements SaveOrGetMethod<Category> {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Category saveOrGet(Category category) {
        return categoryRepository.findByName(category.getName())
                .orElseGet(() -> categoryRepository.save(category));
    }
}
