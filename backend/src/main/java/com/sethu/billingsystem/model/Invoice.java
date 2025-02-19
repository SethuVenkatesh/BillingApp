package com.sethu.billingsystem.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.sethu.billingsystem.constants.PaymentStage;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Set;


@Entity
@Data
@Table(name = "invoice")
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long invoiceId;
    @Column(name = "invoice_number",length = 20,nullable = false)
    private Long invoiceNumber;
    @ManyToOne
    @JoinColumn(name = "firm_id",nullable = false)
    private Firm firm;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "invoice_party_id",nullable = false)
    private InvoiceParty invoiceParty;
    @Temporal(TemporalType.DATE)
    @Column(name = "invoice_date",nullable = false)
    private Date invoiceDate;
    @Column(name = "payment_status",nullable = false)
    private PaymentStage paymentStatus = PaymentStage.NOT_PAID;
    @Column(name = "include_gst",nullable = false)
    private Boolean includeGst = false;
    @Column(name = "cgst_per",precision = 4,scale = 2,nullable = false)
    private BigDecimal cgstPer;
    @Column(name = "sgst_per",precision = 4,scale = 2,nullable = false)
    private BigDecimal sgstPer;
    @Column(name = "cgst_price",precision = 10,scale = 2,nullable = false)
    private BigDecimal cgstPrice;
    @Column(name = "sgst_price",precision = 10,scale = 2,nullable = false)
    private BigDecimal sgstPrice;
    @Column(name = "total_price",precision = 10,scale = 2,nullable = false)
    private BigDecimal totalPrice;
    @Column(name = "subtotal_price",precision = 10,scale = 2,nullable = false)
    private BigDecimal subtotalPrice;

    @OneToMany(mappedBy = "invoice",cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    List<InvoiceItem> invoiceItems;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

}

