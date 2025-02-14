package com.sethu.billingsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class InvoiceItemDTO {
    interface View{
        interface External extends ResponseDTO.View.Public{}
        interface Internal extends External {}
        interface Create extends External {}
        interface Update extends External {}
    }
    @NotBlank(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},message = "Item Name Cannot be blank")
    @Size(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},min = 5,max = 50,message = "Item name must be between 5 to 50 characters")
    @JsonView(value = InvoiceItemDTO.View.External.class)
    private String itemName;
    @NotNull(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},message = "Item Price Cannot be null")
    @DecimalMin(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = "1.00",message = "Item price must be greater than 1.00")
    @DecimalMax(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = "999999.99",message = "Item price must be lesser than 999999.99")
    @Digits(integer = 6,fraction = 2,message = "Item Price must be 6 digits with max of 2 decimal points")
    @JsonView(value = InvoiceItemDTO.View.External.class)
    private BigDecimal price;
    @NotNull(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},message = "Item Quantity Cannot be null")
    @Min(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = 1,message = "Item Quantity cannot be less than 0")
    @JsonView(value = InvoiceItemDTO.View.External.class)
    private Long quantity;
}
