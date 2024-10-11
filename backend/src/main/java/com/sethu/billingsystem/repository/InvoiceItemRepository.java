package com.sethu.billingsystem.repository;

import com.sethu.billingsystem.model.InvoiceItem;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceItemRepository extends JpaRepository<InvoiceItem,Long> {


    @Modifying
    @Transactional
    @Query("DELETE FROM InvoiceItem i WHERE i.invoice.id = :invoiceId")
    void deleteByInvoiceId(@Param("invoiceId") Long invoiceId);
}
