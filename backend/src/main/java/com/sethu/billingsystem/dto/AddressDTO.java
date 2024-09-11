package com.sethu.billingsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;
import jakarta.validation.constraints.Size;
import lombok.Data;


@Data
public class AddressDTO {
    public interface View {
        interface External {}
        interface Internal extends External {}
    }
    @JsonView(value = {View.Internal.class})
    private Long addressId;
    @Size(min = 5, max = 25,message = "Address must be between 5 to 25 characters")
    @JsonView(value = {View.External.class})
    private String address;
    @Size(min = 5, max = 25,message = "City must be between 5 to 25 characters")
    @JsonView(value = {View.External.class})
    private String city;
    @Size(min = 5, max = 25,message = "State must be between 5 to 25 characters")
    @JsonView(value = {View.External.class})
    private String state;
    @Size(min = 6, max = 10,message = "Pincode must be between 6 to 10 characters")
    @JsonView(value = {View.External.class})
    private Long pincode;
}
