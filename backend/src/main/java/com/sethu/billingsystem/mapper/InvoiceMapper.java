package com.sethu.billingsystem.mapper;

import com.sethu.billingsystem.dto.FirmDTO;
import com.sethu.billingsystem.dto.InvoiceDTO;
import com.sethu.billingsystem.dto.InvoiceItemDTO;
import com.sethu.billingsystem.dto.PartyDTO;
import com.sethu.billingsystem.model.Firm;
import com.sethu.billingsystem.model.Invoice;
import com.sethu.billingsystem.model.InvoiceItem;
import com.sethu.billingsystem.model.Party;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {
    void invoiceToInvoiceDTO(Invoice invoice, @MappingTarget InvoiceDTO invoiceDTO);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void invoiceDTOTOInvoice(InvoiceDTO invoiceDTO,@MappingTarget Invoice invoice);
    List<InvoiceItemDTO> invoiceItemListToDTOList(List<InvoiceItem> invoiceItems);

    List<InvoiceDTO> invoiceListToDTOList(List<Invoice> invoices);

}
