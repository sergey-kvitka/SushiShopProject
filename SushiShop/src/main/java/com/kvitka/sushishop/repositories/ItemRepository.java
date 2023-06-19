package com.kvitka.sushishop.repositories;

import com.kvitka.sushishop.entities.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long> {
    void deleteByName(String name);
    Optional<Item> findByName(String name);
}
