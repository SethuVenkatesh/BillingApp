package com.sethu.billingsystem.mapper;

import com.sethu.billingsystem.dto.InvoicePaymentDTO;
import com.sethu.billingsystem.dto.PartyDTO;
import com.sethu.billingsystem.model.InvoicePayment;
import com.sethu.billingsystem.model.Party;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    void paymentToPaymentDTO(InvoicePayment invoicePayment,@MappingTarget InvoicePaymentDTO invoicePaymentDTO);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void paymentDTOtoPayment(InvoicePaymentDTO invoicePaymentDTO,@MappingTarget InvoicePayment invoicePayment);
    List<InvoicePaymentDTO> paymentListToDTOList(List<InvoicePayment> invoicePayments);


}
