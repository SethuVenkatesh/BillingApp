package com.sethu.billingsystem.repository;

import com.sethu.billingsystem.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRespository extends JpaRepository<Address,Long> {

}
