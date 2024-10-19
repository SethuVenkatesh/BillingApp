package com.sethu.billingsystem.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.sethu.billingsystem.dto.InvoiceDTO;
import com.sethu.billingsystem.dto.InvoicePartyDTO;
import com.sethu.billingsystem.dto.InvoicePaymentDTO;
import com.sethu.billingsystem.model.ApiResponse;
import com.sethu.billingsystem.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity <ApiResponse<Object>> getAllInvoice(){
        return invoiceService.getAllInvoice();
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
