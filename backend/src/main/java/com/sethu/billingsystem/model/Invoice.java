package com.sethu.billingsystem.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.sethu.billingsystem.constants.PaymentStage;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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
    @Column(name = "invoice_number")
    private Long invoiceNumber;
    @ManyToOne
    @JoinColumn(name = "firm_id")
    private Firm firm;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "invoice_party_id")
    private InvoiceParty invoiceParty;
    @Temporal(TemporalType.DATE)
    @Column(name = "invoice_date")
    private Date invoiceDate;
    @Column(name = "payment_status")
    private PaymentStage paymentStatus = PaymentStage.NOT_PAID;
    @Column(name = "include_gst")
    private Boolean includeGst;
    @Column(name = "cgst_per")
    private Long cgstPer;
    @Column(name = "sgst_per")
    private Long sgstPer;
    @Column(name = "cgst_price")
    private Long cgstPrice;
    @Column(name = "sgst_price")
    private Long sgstPrice;
    @Column(name = "total_price")
    private Long totalPrice;
    @Column(name = "subtotal_price")
    private Long subtotalPrice;

    @OneToMany(mappedBy = "invoice",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    List<InvoiceItem> invoiceItems;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

}

