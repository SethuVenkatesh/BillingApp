package com.sethu.billingsystem.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.sethu.billingsystem.dto.InvoiceDTO;
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
    @JsonView(value = {InvoiceDTO.View.External.class})
    public ResponseEntity<ApiResponse<Object>> createInvoice(@RequestBody @Validated(value = {InvoiceDTO.View.Create.class}) @JsonView(value = {InvoiceDTO.View.Create.class}) InvoiceDTO requestBody){
        return invoiceService.createInvoice(requestBody);
    }


    @PatchMapping("/update")
    @JsonView(value = {InvoiceDTO.View.External.class})
    public ResponseEntity<ApiResponse<Object>> updateInvoice(@RequestParam(required = true) Long invoiceId,@RequestBody @Validated(value = {InvoiceDTO.View.Update.class}) @JsonView(value = {InvoiceDTO.View.Create.class}) InvoiceDTO requestBody){
        return invoiceService.updateInvoice(invoiceId,requestBody);
    }
    @GetMapping("/all")
    @JsonView(value = {InvoiceDTO.View.External.class})
    public ResponseEntity <ApiResponse<Object>> getAllInvoice(){
        return invoiceService.getAllInvoice();
    }
}
