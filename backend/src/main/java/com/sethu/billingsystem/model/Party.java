package com.sethu.billingsystem.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "parties")
public class Party {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long partyId;
    @Column(name = "party_name")
    private String partyName;
    @Column(name = "logo_url")
    private String logoUrl;
    @Column(name = "email_id")
    private String email;
    @Column(name = "GST_number")
    private String gstNumber;
    @Column(name = "mobile_number")
    private String mobileNumber;
    @Column(name = "alt_mobile_number")
    private String altMobileNumber;
    @Column(name = "is_deleted")
    private Boolean isDeleted = false;
    @ManyToOne
    private Firm firm;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "bank_id")
    private Bank bank;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;
}
