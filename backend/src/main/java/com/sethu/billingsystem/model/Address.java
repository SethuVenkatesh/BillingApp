package com.sethu.billingsystem.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "adddress")
@Getter
@Setter
@NoArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private Long addressId;
    private String address;
    private String city;
    private String state;
    private Long pincode;
    @OneToOne(mappedBy = "address")
    private Firm firm;
    @OneToOne(mappedBy = "address")
    private Party party;
}
