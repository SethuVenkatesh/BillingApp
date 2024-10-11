package com.sethu.billingsystem.service;

import com.sethu.billingsystem.dto.InvoiceDTO;
import com.sethu.billingsystem.dto.InvoiceItemDTO;
import com.sethu.billingsystem.mapper.InvoiceMapper;
import com.sethu.billingsystem.model.*;
import com.sethu.billingsystem.repository.InvoiceItemRepository;
import com.sethu.billingsystem.repository.InvoiceRepository;
import com.sethu.billingsystem.utils.CommonUtil;
import com.sethu.billingsystem.utils.FirmUtil;
import com.sethu.billingsystem.utils.UserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class InvoiceService {

    @Autowired
    UserUtil userUtil;
    @Autowired
    FirmUtil firmUtil;
    @Autowired
    CommonUtil util;
    @Autowired
    InvoiceRepository invoiceRepository;
    @Autowired
    InvoiceItemRepository invoiceItemRepository;
    @Autowired
    InvoiceMapper invoiceMapper;
    public ResponseEntity<ApiResponse<Object>> createInvoice(InvoiceDTO requestBody) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        boolean isAllNull = util.isNullAllFields(requestBody);
        if(isAllNull){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Empty Values are passed for invoice",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Customer user = userUtil.getUserDetails(userName);
        Firm firmDetails = firmUtil.getFirmDetails(user.getUserId());
        Invoice invoice = new Invoice();
        invoiceMapper.invoiceDTOTOInvoice(requestBody,invoice);
        invoice.setFirm(firmDetails);
        List<InvoiceItem> invoiceItems = new ArrayList<>();
        for(InvoiceItem item : invoice.getInvoiceItems()){
            InvoiceItem invoiceItem = new InvoiceItem();
            invoiceItem.setItemName(item.getItemName());
            invoiceItem.setPrice(item.getPrice());
            invoiceItem.setQuantity(item.getQuantity());
            invoiceItems.add(invoiceItem);
        }
        invoice.setInvoiceItems(new ArrayList<>());
        Invoice savedInVoice  =invoiceRepository.save(invoice);
        for (InvoiceItem item : invoiceItems){
            item.setInvoice(savedInVoice);
        }
        List<InvoiceItem> savedInvoiceItems = invoiceItemRepository.saveAll(invoiceItems);
        InvoiceDTO savedInvoiceDTO = new InvoiceDTO();
        invoiceMapper.invoiceToInvoiceDTO(savedInVoice,savedInvoiceDTO);
        List<InvoiceItemDTO> savedInvoiceItemDTO = invoiceMapper.invoiceItemListToDTOList(savedInvoiceItems);
        savedInvoiceDTO.setInvoiceItems(savedInvoiceItemDTO);
        ApiResponse<Object> response = new ApiResponse<>(true,"Invoice Created",savedInvoiceDTO);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }


    public ResponseEntity<ApiResponse<Object>> getAllInvoice() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        Customer user = userUtil.getUserDetails(userName);
        Firm firmDetails = firmUtil.getFirmDetails(user.getUserId());
        List<Invoice> allInvoices = invoiceRepository.findByFirmFirmId(firmDetails.getFirmId());
        List<InvoiceDTO> allInvoiceDTO = invoiceMapper.invoiceListToDTOList(allInvoices);
        ApiResponse<Object> response =new  ApiResponse<>(true,"List of Invoices fetched successfully",allInvoiceDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<ApiResponse<Object>> updateInvoice(Long invoiceId, InvoiceDTO requestBody) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        boolean isAllNull = util.isNullAllFields(requestBody);
        if(isAllNull){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Empty Values are passed for invoice",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Customer user = userUtil.getUserDetails(userName);
        Firm firmDetails = firmUtil.getFirmDetails(user.getUserId());
        Invoice invoice = invoiceRepository.findByInvoiceIdAndFirmFirmId(invoiceId,firmDetails.getFirmId());
        if(invoice==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"invoice not found",null);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        invoiceMapper.invoiceDTOTOInvoice(requestBody,invoice);
        if(requestBody.getInvoiceItems()!=null){

            invoice.setInvoiceItems(new ArrayList<>());
            invoiceItemRepository.deleteByInvoiceId(invoiceId);
            List<InvoiceItem> invoiceItems = new ArrayList<>();
            for(InvoiceItemDTO item : requestBody.getInvoiceItems()) {
                InvoiceItem invoiceItem = new InvoiceItem();
                invoiceItem.setItemName(item.getItemName());
                invoiceItem.setPrice(item.getPrice());
                invoiceItem.setQuantity(item.getQuantity());
                invoiceItem.setInvoice(invoice);
                invoiceItems.add(invoiceItem);
            }
            invoice.setInvoiceItems(invoiceItems);
        }
        invoiceRepository.save(invoice);
        InvoiceDTO invoiceDTO = new InvoiceDTO();
        invoiceMapper.invoiceToInvoiceDTO(invoice,invoiceDTO);
        ApiResponse<Object> response = new ApiResponse<>(true,"Invoice Updated successfully",invoiceDTO);
        return new ResponseEntity<>(response,HttpStatus.OK);

    }
}
