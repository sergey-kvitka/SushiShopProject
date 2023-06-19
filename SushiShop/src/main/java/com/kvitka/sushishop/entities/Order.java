package com.kvitka.sushishop.entities;

import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Entity(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Order {
    @Id
    @GeneratedValue
    private Long id;

    private Long userId;

    private String username;
    private String firstName;
    private String lastName;

    private Date date;

    @Column(length = 5000)
    private String orderData;

    private String phoneNumber;

    private String address;

    private String comment;
}
