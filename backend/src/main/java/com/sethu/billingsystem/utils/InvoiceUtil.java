package com.sethu.billingsystem.utils;

import com.sethu.billingsystem.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
public class InvoiceUtil {

    @Autowired
    InvoiceRepository invoiceRepository;
    public Long getNextInvoiceNumber(Long firmId){

       return invoiceRepository.countByFirmFirmId(firmId);
    }

}
