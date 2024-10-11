package com.sethu.billingsystem.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "banks")
public class Bank {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bank_id")
    private Long bankId;
    @Column(name = "account_number")
    private Long accountNumber;
    @Column(name = "bank_name")
    private String bankName;
    private String branch;
    @Column(name = "IFSC_code")
    private String ifscCode;
//    @OneToOne(mappedBy = "bank")
//    private Firm firm;
//    @OneToOne(mappedBy = "bank")
//    private Party party;
}
