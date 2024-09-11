package com.sethu.billingsystem.repository;

import com.sethu.billingsystem.model.Firm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FirmRepository extends JpaRepository<Firm,Long> {
    public Firm findByUserUserId(Long userId);
    public Firm findByUserEmail(String emailId);

    public Firm findByFirmName(String firmName);
}
