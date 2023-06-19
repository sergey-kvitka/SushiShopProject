package com.kvitka.sushishop.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Category {
    @Id
    @GeneratedValue
    private Long id;

    @Column(unique = true)
    private String name;

    @Column
    private String hyperCategory;

    public Category(String name) {
        this.name = name;
    }
}
