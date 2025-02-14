package com.sethu.billingsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.Column;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

@Data
public class ItemDTO {
    public interface View {
        interface External extends ResponseDTO.View.Public,PartyDTO.View.External{}
        interface Internal extends External {}
        interface Create extends External{}
        interface Update extends External{}
    }
    @JsonView(value = {ItemDTO.View.Internal.class})
    private Long itemId;
    @Size(groups = {ItemDTO.View.Create.class,ItemDTO.View.Update.class},min = 5, max = 50,message = "Item Name must be 5 and 50 characters")
    @NotBlank(groups = {ItemDTO.View.Create.class},message = "Item Name Cannot Be Blank")
    @JsonView(value = {ItemDTO.View.External.class})
    private String itemName;
    @DecimalMin(groups = {ItemDTO.View.Create.class,ItemDTO.View.Update.class},value = "1.00",message = "price must be greater than 1.00")
    @DecimalMax(groups = {ItemDTO.View.Create.class,ItemDTO.View.Update.class},value = "999999.99",message = "price must be lesser than 999999.99")
    @Digits(integer = 6,fraction = 2,message = "price must be number with 8 digits and maximum of 2 decimal points ")
    @JsonView(value = {ItemDTO.View.External.class})
    private BigDecimal price;
    @JsonView(value = {ItemDTO.View.External.class})
    private LocalDateTime createdAt;
    @JsonView(value = {ItemDTO.View.External.class})
    private PartyDTO party;

}
