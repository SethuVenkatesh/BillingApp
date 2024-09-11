package com.sethu.billingsystem.repository;

import com.sethu.billingsystem.model.Customer;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Customer,Long> {
    public Customer findOneByUserName(String username);
    Optional<Customer> findByUserName(String username);

}
