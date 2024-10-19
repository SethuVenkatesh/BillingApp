package com.sethu.billingsystem.dto;


import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.Column;
import jakarta.validation.constraints.*;
import lombok.Data;

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
    @Min(groups = {InvoicePaymentDTO.View.External.class},value = 10,message = "Amount must be greater than 10")
    @Max(groups = {InvoicePaymentDTO.View.External.class},value = 10000000,message = "Amount must be less than 10000000")
    private Long amountPaid;
}
