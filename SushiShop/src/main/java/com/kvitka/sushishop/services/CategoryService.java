package com.kvitka.sushishop.services;

import com.kvitka.sushishop.entities.Category;
import com.kvitka.sushishop.repositories.CategoryRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
