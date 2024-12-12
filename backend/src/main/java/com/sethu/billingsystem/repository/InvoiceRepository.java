package com.sethu.billingsystem.repository;

import com.sethu.billingsystem.model.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice,Long> {
    Invoice findByInvoiceNumberAndFirmFirmId(Long invoiceNumber,Long firmId);

    List<Invoice> findByFirmFirmIdOrderByInvoiceDateDesc(Long firmId);
    Page<Invoice> findAll(Specification specification,Pageable pageable);

    Long countByFirmFirmId(Long firmId);
}
