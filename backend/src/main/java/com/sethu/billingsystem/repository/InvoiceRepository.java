package com.sethu.billingsystem.repository;

import com.sethu.billingsystem.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice,Long> {
    Invoice findByInvoiceNumberAndFirmFirmId(Long invoiceNumber,Long firmId);

    List<Invoice> findByFirmFirmIdOrderByInvoiceDateDesc(Long firmId);

    Long countByFirmFirmId(Long firmId);

}
