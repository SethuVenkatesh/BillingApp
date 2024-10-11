package com.sethu.billingsystem.repository;

import com.sethu.billingsystem.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice,Long> {
    Invoice findByInvoiceIdAndFirmFirmId(Long invoiceId,Long firmId);

    List<Invoice> findByFirmFirmId(Long firmId);

}
