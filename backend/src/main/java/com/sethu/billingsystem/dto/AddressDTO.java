package com.sethu.billingsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;
import jakarta.validation.constraints.*;
import lombok.Data;


@Data
public class AddressDTO {
    public interface View {
        interface External {}
        interface Internal extends External {}
    }
    @JsonView(value = {View.Internal.class})
    private Long addressId;
    @NotBlank(groups = {InvoiceDTO.View.Create.class},message = "address cannot be blank")
    @Size(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},min = 5, max = 50,message = "Address must be between 5 to 50 characters")
    @JsonView(value = {View.External.class})
    private String address;
    @NotBlank(groups = {InvoiceDTO.View.Create.class},message = "city name cannot be blank")
    @Size(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},min = 5, max = 50,message = "City must be between 5 to 50 characters")
    @JsonView(value = {View.External.class})
    private String city;
    @NotBlank(groups = {InvoiceDTO.View.Create.class},message = "state name cannot be blank")
    @Size(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},min = 2, max = 10,message = "State must be between 2 to 10 characters")
    @JsonView(value = {View.External.class})
    private String state;
    @NotNull(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class}, message = "Pincode cannot be null")
    @Min(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value=100000,message = "Pincode must be at least 6 digits")
    @Max(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value=999999,message = "Pincode must be at most 6 digits")
    @JsonView(value = {View.External.class})
    private Long pincode;
}
