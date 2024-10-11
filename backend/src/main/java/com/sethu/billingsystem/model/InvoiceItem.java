package com.sethu.billingsystem.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Data
@Table(name = "invoice_item")
public class InvoiceItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long invoiceItemId;
    @Column(name = "item_name")
    private String itemName;
    @Column(name = "price")
    private Long price;
    @Column(name = "quantity")
    private Long quantity;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id",nullable = false)
    private Invoice invoice;
    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;


}
