package com.sethu.billingsystem.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.sethu.billingsystem.constants.PaymentStage;
import com.sethu.billingsystem.dto.InvoiceDTO;
import com.sethu.billingsystem.dto.InvoicePartyDTO;
import com.sethu.billingsystem.dto.InvoicePaymentDTO;
import com.sethu.billingsystem.model.ApiResponse;
import com.sethu.billingsystem.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@Controller
@RequestMapping(value = "/api/invoice")
public class InvoiceController {

    @Autowired
    InvoiceService invoiceService;

    @PostMapping("/new")
    @JsonView(value = {InvoiceDTO.View.Create.class})
    public ResponseEntity<ApiResponse<Object>> createInvoice(@RequestBody @Validated(value = {InvoiceDTO.View.Create.class}) @JsonView(value = {InvoiceDTO.View.Create.class}) InvoiceDTO requestBody){
        return invoiceService.createInvoice(requestBody);
    }


    @PatchMapping("/update")
    @JsonView(value = {InvoiceDTO.View.External.class})
    public ResponseEntity<ApiResponse<Object>> updateInvoice(@RequestParam(required = true) Long invoiceNumber,@RequestBody @Validated(value = {InvoiceDTO.View.Update.class}) @JsonView(value = {InvoiceDTO.View.Create.class}) InvoiceDTO requestBody){
        return invoiceService.updateInvoice(invoiceNumber,requestBody);
    }
    @GetMapping("/all")
    @JsonView(value = {InvoiceDTO.View.External.class})
    public ResponseEntity <ApiResponse<Object>> getAllInvoice(@RequestParam(required = false,defaultValue = "1") Integer pageNum, @RequestParam(required = false,defaultValue = "20") Integer pageSize, @RequestParam(required = false,defaultValue = "desc") String sortType, @RequestParam(required = false,defaultValue = "invoiceDate") String sortKey, @RequestParam(required = false,defaultValue = "0") Long invoiceNumber, @RequestParam(required = false,defaultValue = "") String partyName, @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date invoiceStartDate, @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date  invoiceEndDate, @RequestParam(required = false) PaymentStage paymentStatus)
    {
        return invoiceService.getAllInvoice(pageNum,pageSize,sortKey,sortType,invoiceNumber,partyName,invoiceStartDate,invoiceEndDate,paymentStatus);
    }

    @GetMapping("/details")
    @JsonView(value = {InvoiceDTO.View.External.class})
    public ResponseEntity <ApiResponse<Object>> getAllInvoiceDetails(@RequestParam Long invoiceNumber){
        return invoiceService.getInvoiceDetails(invoiceNumber);
    }


    @GetMapping("/payments")
    public ResponseEntity <ApiResponse<Object>> getAllPayments(@RequestParam Long invoiceNumber){
        return invoiceService.getAllPayments(invoiceNumber);
    }

    @PostMapping("/payments")
    public ResponseEntity <ApiResponse<Object>> makePayments(@RequestParam Long invoiceNumber, @RequestBody InvoicePaymentDTO requestBody){
        return invoiceService.makePayment(invoiceNumber,requestBody);
    }
}
