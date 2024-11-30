package com.sethu.billingsystem.dto;


import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.Column;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class InvoicePaymentDTO {
    public interface View{
        interface Create extends ResponseDTO.View.Public{}
        interface External extends ResponseDTO.View.Public{}

    }
    @JsonView(value = {InvoicePaymentDTO.View.External.class})
    @NotNull(groups = {InvoicePaymentDTO.View.Create.class},message = "Payment Date Cannot be blank")
    private Date paymentDate;
    @JsonView(value = {InvoicePaymentDTO.View.External.class})
    @NotBlank(groups = {InvoicePaymentDTO.View.Create.class},message = "Payment Mode Cannot be blank")
    private String paymentMode;
    @JsonView(value = {InvoicePaymentDTO.View.External.class})
    @NotNull(groups = {InvoicePaymentDTO.View.Create.class},message = "amount cannot be blank")
    @DecimalMin(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = "1.00",message = "amount must be greater than 1.00")
    @DecimalMax(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = "99999999.99",message = "amount must be lesser than 99999999.99")
    @Digits(integer = 8,fraction = 2,message = "amount must be 10 digits with max of 2 decimal points")
    private BigDecimal amountPaid;
}
