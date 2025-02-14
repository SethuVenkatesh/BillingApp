package com.sethu.billingsystem.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "address")
@Getter
@Setter
@NoArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private Long addressId;
    @Column(length = 50)
    private String address;
    @Column(length = 50)
    private String city;
    @Column(length = 10)
    private String state;
    private Long pincode;
//    @OneToOne(mappedBy = "address")
//    private Firm firm;
//    @OneToOne(mappedBy = "address")
//    private Party party;
}
