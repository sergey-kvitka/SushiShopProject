package com.kvitka.sushishop.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity(name = "items")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Item {
    @Id
    @GeneratedValue
    private Long id;

    @Column(unique = true)
    private String name;

    private Double price;

    private String description;

    private String imagePath;

    @ManyToOne
    private Category category;

    public Item(String name, Double price, String description, String imagePath, Category category) {
        this.name = name;
        this.price = price;
        this.description = description;
        this.imagePath = imagePath;
        this.category = category;
    }
}
