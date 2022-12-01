package com.kvitka.sushishop.entities;

import com.kvitka.sushishop.interfaces.CatalogItem;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity(name = "food")
@Getter
@Setter
@NoArgsConstructor
public class Food implements CatalogItem {
    @Id
    @GeneratedValue
    private Long id;

    private Integer amount;

    private Integer weight;

    private Integer calories;

    @OneToOne
    @MapsId
    @JoinColumn(name = "item_id")
    private Item item;

    @ManyToMany
    private List<Ingredient> ingredients;

    public Food(Integer amount, Integer weight, Integer calories, Item item, List<Ingredient> ingredients) {
        this.amount = amount;
        this.weight = weight;
        this.calories = calories;
        this.item = item;
        this.ingredients = ingredients;
    }

    @Override
    public String toString() {
        return "Food{" +
                "id=" + id +
                ", amount=" + amount +
                ", weight=" + weight +
                ", calories=" + calories +
                ", item=" + item +
                ", ingredients=" + ingredients +
                '}';
    }
}
