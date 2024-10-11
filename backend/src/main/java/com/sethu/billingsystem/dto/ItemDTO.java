package com.sethu.billingsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

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
    @Size(groups = {ItemDTO.View.Create.class,ItemDTO.View.Update.class},min = 5, max = 25,message = "Item Name must be 5 and 25 characters")
    @NotBlank(groups = {ItemDTO.View.Create.class},message = "Item Name Cannot Be Blank")
    @JsonView(value = {ItemDTO.View.External.class})
    private String itemName;
    @Min(groups = {ItemDTO.View.Create.class,ItemDTO.View.Update.class},value = 1,message = "price must be greater then 0")
    @JsonView(value = {ItemDTO.View.External.class})
    private Long price;
    @JsonView(value = {ItemDTO.View.External.class})
    private PartyDTO party;

}
