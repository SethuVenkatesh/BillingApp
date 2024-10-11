package com.sethu.billingsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;
import lombok.Data;

@Data
public class InvoiceItemDTO {
    interface View{
        interface External extends ResponseDTO.View.Public{}
        interface Internal extends External {}
        interface Create extends External {}
        interface Update extends External {}
    }
    @JsonView(value = InvoiceItemDTO.View.External.class)
    private String itemName;
    @JsonView(value = InvoiceItemDTO.View.External.class)
    private Long price;
    @JsonView(value = InvoiceItemDTO.View.External.class)
    private Long quantity;
}
