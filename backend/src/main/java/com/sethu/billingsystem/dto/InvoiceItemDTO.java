package com.sethu.billingsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class InvoiceItemDTO {
    interface View{
        interface External extends ResponseDTO.View.Public{}
        interface Internal extends External {}
        interface Create extends External {}
        interface Update extends External {}
    }
    @NotBlank(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},message = "Item Name Cannot be blank")
    @Size(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},min = 5,max = 25,message = "Item name cannot be blank")
    @JsonView(value = InvoiceItemDTO.View.External.class)
    private String itemName;
    @NotNull(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},message = "Item Price Cannot be null")
    @Min(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = 1,message = "Item Price cannot be less than 0")
    @JsonView(value = InvoiceItemDTO.View.External.class)
    private Long price;
    @NotNull(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},message = "Item Quantity Cannot be null")
    @Min(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = 1,message = "Item Quantity cannot be less than 0")
    @JsonView(value = InvoiceItemDTO.View.External.class)
    private Long quantity;
}
