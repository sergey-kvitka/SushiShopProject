package com.kvitka.sushishop.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Length;
import org.springframework.lang.Nullable;

@Entity(name = "items")
@Getter
@Setter
@NoArgsConstructor
public class Item {
    @Id
    @GeneratedValue
    private Long id;

    @Column(unique = true)
    private String name;

    private Double price;

    @Column(length = Length.LOB_DEFAULT)
    private String description;

    @Column(length = Length.LOB_DEFAULT)
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

    @Override
    public String toString() {
        return "Item{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", price=" + price +
                ", description='" + description + '\'' +
                ", imagePath='" + imagePath + '\'' +
                ", category=" + category +
                '}';
    }
}
