package com.sethu.billingsystem.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "parties")
public class Party {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long partyId;
    @Column(name = "party_name",nullable = false,length = 100)
    private String partyName;
    @Column(name = "logo_url")
    private String logoUrl;
    @Column(name = "email_id",length = 50,nullable = false)
    private String email;
    @Column(name = "GST_number",length = 15)
    private String gstNumber;
    @Column(name = "mobile_number",length = 10)
    private String mobileNumber;
    @Column(name = "alt_mobile_number",length = 10)
    private String altMobileNumber;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "firm_id",nullable = false)
    private Firm firm;
    @OneToOne(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JoinColumn(name = "bank_id",nullable = false)
    private Bank bank;
    @OneToOne(cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    @JoinColumn(name = "address_id",nullable = false)
    private Address address;
    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
