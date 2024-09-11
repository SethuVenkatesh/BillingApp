package com.sethu.billingsystem.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "items")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long itemId;
    @Column(name = "item_name")
    private String itemName;
    @Column(name = "price")
    private Long price;
    @ManyToOne
    private Party party;
}
