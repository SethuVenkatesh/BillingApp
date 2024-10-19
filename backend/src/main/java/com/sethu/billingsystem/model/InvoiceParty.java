package com.sethu.billingsystem.model;


import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "invoice_party")
public class InvoiceParty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long invoicePartyId;
    @Column(name = "party_name")
    private String partyName;
    @Column(name = "email_id")
    private String email;
    @Column(name = "GST_number")
    private String gstNumber;
    @Column(name = "mobile_number")
    private String mobileNumber;
    @Column(name = "alt_mobile_number")
    private String altMobileNumber;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;
    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToOne(mappedBy = "invoiceParty")
    private Invoice invoice;
}
