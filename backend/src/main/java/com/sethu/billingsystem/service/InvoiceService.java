package com.sethu.billingsystem.service;

import com.sethu.billingsystem.constants.PaymentStage;
import com.sethu.billingsystem.dto.InvoiceDTO;
import com.sethu.billingsystem.dto.InvoiceItemDTO;
import com.sethu.billingsystem.dto.InvoicePaymentDTO;
import com.sethu.billingsystem.mapper.InvoiceMapper;
import com.sethu.billingsystem.mapper.PaymentMapper;
import com.sethu.billingsystem.model.*;
import com.sethu.billingsystem.repository.InvoiceItemRepository;
import com.sethu.billingsystem.repository.InvoicePaymentRepository;
import com.sethu.billingsystem.repository.InvoiceRepository;
import com.sethu.billingsystem.specification.InvoiceSpecification;
import com.sethu.billingsystem.utils.CommonUtil;
import com.sethu.billingsystem.utils.FirmUtil;
import com.sethu.billingsystem.utils.InvoiceUtil;
import com.sethu.billingsystem.utils.UserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class InvoiceService {

    @Autowired
    UserUtil userUtil;
    @Autowired
    FirmUtil firmUtil;
    @Autowired
    CommonUtil util;

    @Autowired
    InvoiceSpecification invoiceSpecification;

    @Autowired
    InvoiceRepository invoiceRepository;
    @Autowired
    InvoiceItemRepository invoiceItemRepository;
    @Autowired
    InvoicePaymentRepository invoicePaymentRepository;
    @Autowired
    InvoiceMapper invoiceMapper;
    @Autowired
    PaymentMapper paymentMapper;
    @Autowired
    InvoiceUtil invoiceUtil;
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
        if(firmDetails==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Don't have any firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
        invoice.setInvoiceNumber(invoiceUtil.getNextInvoiceNumber(firmDetails.getFirmId())+1);
        Invoice savedInVoice  =invoiceRepository.save(invoice);
        for (InvoiceItem item : invoiceItems){
            item.setInvoice(savedInVoice);
        }
        List<InvoiceItem> savedInvoiceItems = invoiceItemRepository.saveAll(invoiceItems);
        InvoiceDTO savedInvoiceDTO = new InvoiceDTO();
        invoiceMapper.invoiceToInvoiceDTO(savedInVoice,savedInvoiceDTO);
        List<InvoiceItemDTO> savedInvoiceItemDTO = invoiceMapper.invoiceItemListToDTOList(savedInvoiceItems);
        savedInvoiceDTO.setInvoiceItems(savedInvoiceItemDTO);
        ApiResponse<Object> response = new ApiResponse<>(true,"Invoice Created Sucessfully",savedInvoiceDTO);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }


    public ResponseEntity<ApiResponse<Object>> getAllInvoice(Integer pageNum, Integer pageSize, String sortKey, String sortType, Long invoiceNumber, String partyName, Date invoiceStartDate, Date invoiceEndDate, PaymentStage paymentStatus) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        Customer user = userUtil.getUserDetails(userName);
        Firm firmDetails = firmUtil.getFirmDetails(user.getUserId());
        if(firmDetails==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Don't have any firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Sort sort = sortType.equals("desc")? Sort.by(sortKey).descending() : Sort.by(sortKey).ascending();
        Pageable invoicePageable = PageRequest.of(pageNum-1,pageSize,sort);
//        List<Invoice> allInvoices = invoiceRepository.findByFirmFirmIdOrderByInvoiceDateDesc(firmDetails.getFirmId());
        Page<Invoice> allInvoices = invoiceRepository.findAll(invoiceSpecification.findAllInvoice(invoiceNumber,partyName,paymentStatus,invoiceStartDate,invoiceEndDate, firmDetails.getFirmId()),invoicePageable);
        List<InvoiceDTO> allInvoiceDTO = invoiceMapper.invoiceListToDTOList(allInvoices.getContent());
        ApiResponse<Object> response =new  ApiResponse<>(true,"List of Invoices fetched successfully",allInvoiceDTO,allInvoices.getPageable().getPageNumber()+1,allInvoices.getPageable().getPageSize(), allInvoices.getTotalElements(), allInvoices.getTotalPages());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public ResponseEntity<ApiResponse<Object>> updateInvoice(Long invoiceNumber, InvoiceDTO requestBody) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        boolean isAllNull = util.isNullAllFields(requestBody);
        if(isAllNull){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Empty Values are passed for invoice",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Customer user = userUtil.getUserDetails(userName);
        Firm firmDetails = firmUtil.getFirmDetails(user.getUserId());
        if(firmDetails==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Don't have any firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Invoice invoice = invoiceRepository.findByInvoiceNumberAndFirmFirmId(invoiceNumber,firmDetails.getFirmId());
        if(invoice==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"invoice not found",null);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        List<InvoicePayment> invoicePayment = invoicePaymentRepository.findByInvoiceInvoiceId(invoice.getInvoiceId());
        if(!invoicePayment.isEmpty()){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Invoice cannot be updated after payment is done",null);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        invoiceMapper.invoiceDTOTOInvoice(requestBody,invoice);
        if(requestBody.getInvoiceItems()!=null){
            invoice.setInvoiceItems(new ArrayList<>());
            invoiceItemRepository.deleteByInvoiceId(invoice.getInvoiceId());
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

    public ResponseEntity<ApiResponse<Object>> getAllPayments(Long invoiceNumber) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        Customer user = userUtil.getUserDetails(userName);
        Firm firmDetails = firmUtil.getFirmDetails(user.getUserId());
        if(firmDetails==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Don't have any firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Invoice invoice = invoiceRepository.findByInvoiceNumberAndFirmFirmId(invoiceNumber,firmDetails.getFirmId());
        if(invoice==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"invoice not found",null);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        List<InvoicePayment> invoicePayment = invoicePaymentRepository.findByInvoiceInvoiceId(invoice.getInvoiceId());
        List<InvoicePaymentDTO> paymentDTOS = paymentMapper.paymentListToDTOList(invoicePayment);
        ApiResponse<Object> response = new ApiResponse<>(true,"List of Payments for the invoice",paymentDTOS);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    public ResponseEntity<ApiResponse<Object>> makePayment(Long invoiceNumber,InvoicePaymentDTO requestBody) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        Customer user = userUtil.getUserDetails(userName);
        Firm firmDetails = firmUtil.getFirmDetails(user.getUserId());
        if(firmDetails==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Don't have any firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Invoice invoice = invoiceRepository.findByInvoiceNumberAndFirmFirmId(invoiceNumber,firmDetails.getFirmId());
        if(invoice==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"invoice not found",null);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        if(invoice.getPaymentStatus() == PaymentStage.FULLY_PAID){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Payment is already completed for invoice",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
//        Logic for Making Invoice Payments
        List<InvoicePayment> invoicePayment = invoicePaymentRepository.findByInvoiceInvoiceId(invoice.getInvoiceId());
        BigDecimal totalAmount = invoicePayment.stream().map(InvoicePayment::getAmountPaid).reduce(BigDecimal.ZERO,BigDecimal::add);
        if(totalAmount.add(requestBody.getAmountPaid()).compareTo(invoice.getTotalPrice()) > 0 ){
            ApiResponse<Object> response =new ApiResponse<>(false,"amount exceeds total bill amount",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        InvoicePayment payment = new InvoicePayment();
        paymentMapper.paymentDTOtoPayment(requestBody,payment);
        payment.setInvoice(invoice);
        invoicePaymentRepository.save(payment);

        if(totalAmount.add(requestBody.getAmountPaid()).equals(invoice.getTotalPrice())){
            invoice.setPaymentStatus(PaymentStage.FULLY_PAID);
            invoiceRepository.save(invoice);

        } else if(invoice.getPaymentStatus() == PaymentStage.NOT_PAID) {
            invoice.setPaymentStatus(PaymentStage.PARTIALLY_PAID);
            invoiceRepository.save(invoice);
        }
        InvoicePaymentDTO paymentDTO = new InvoicePaymentDTO();
        paymentMapper.paymentToPaymentDTO(payment,paymentDTO);
        ApiResponse<Object> response = new ApiResponse<>(true,"Payment Successfull for the invoice",paymentDTO);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    public ResponseEntity<ApiResponse<Object>> getInvoiceDetails(Long invoiceNumber) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        Customer user = userUtil.getUserDetails(userName);
        Firm firmDetails = firmUtil.getFirmDetails(user.getUserId());
        if(firmDetails==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Don't have any firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Invoice invoice = invoiceRepository.findByInvoiceNumberAndFirmFirmId(invoiceNumber,firmDetails.getFirmId());
        if(invoice==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"invoice not found",null);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        InvoiceDTO invoiceDTO = new InvoiceDTO();
        invoiceMapper.invoiceToInvoiceDTO(invoice,invoiceDTO);
        ApiResponse<Object> response = new ApiResponse<>(true,"Invoice Details fetched successfully",invoiceDTO);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }
}
