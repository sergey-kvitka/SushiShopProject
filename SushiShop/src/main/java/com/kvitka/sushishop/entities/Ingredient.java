package com.kvitka.sushishop.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity(name = "ingredients")
@Getter
@Setter
@NoArgsConstructor
public class Ingredient {
    @Id
    @GeneratedValue
    private Long id;

    @Column(unique = true)
    private String name;

    private String description;

    public Ingredient(String name, String description) {
        this.name = name;
        this.description = description;
    }

    @Override
    public String toString() {
        return "Ingredient{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
