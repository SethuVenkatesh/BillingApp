package com.sethu.billingsystem.model;


import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Data
@Table(name = "firms")
public class Firm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long firmId;
    @Column(name = "firm_name")
    private String firmName;
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
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "bank_id")
    private Bank bank;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id")
    private Address address;
    @OneToOne
    private Customer user;

}
