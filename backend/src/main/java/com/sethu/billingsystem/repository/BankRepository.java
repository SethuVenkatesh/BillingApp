package com.sethu.billingsystem.repository;

import com.sethu.billingsystem.model.Bank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankRepository extends JpaRepository<Bank,Long> {
}
