package com.sethu.billingsystem.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Data
@Table(name = "invoice_payment")
public class InvoicePayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long invoicePaymentId;
    @Column(name = "payment_date")
    private Date paymentDate;
    @Column(name = "payment_mode")
    private String paymentMode;
    @Column(name = "amount_paid")
    private Long amountPaid;
    @ManyToOne
    private Invoice invoice;

}
