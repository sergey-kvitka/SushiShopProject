package com.kvitka.sushishop.repositories;

import com.kvitka.sushishop.entities.ExtraItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ExtraItemRepository extends JpaRepository<ExtraItem, Long> {
}
