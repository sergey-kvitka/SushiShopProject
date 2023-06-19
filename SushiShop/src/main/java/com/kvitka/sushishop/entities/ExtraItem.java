package com.kvitka.sushishop.entities;

import com.kvitka.sushishop.interfaces.CatalogItem;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity(name = "extras")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExtraItem implements CatalogItem {
    @Id
    @GeneratedValue
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "item_id")
    private Item item;

    @Override
    public String toString() {
        return "ExtraItem{" +
                "id=" + id +
                ", item=" + item +
                '}';
    }
}
