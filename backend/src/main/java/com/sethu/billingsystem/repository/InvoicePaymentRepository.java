package com.sethu.billingsystem.repository;

import com.sethu.billingsystem.mapper.InvoiceMapper;
import com.sethu.billingsystem.model.InvoicePayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvoicePaymentRepository extends JpaRepository<InvoicePayment,Long> {
    List<InvoicePayment> findByInvoiceInvoiceId(Long invoiceId);
}
