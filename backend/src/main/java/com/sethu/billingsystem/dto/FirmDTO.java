package com.sethu.billingsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;



@Data
public class FirmDTO {
    public interface View {
        interface External extends ResponseDTO.View.Public,AddressDTO.View.External,BankDTO.View.External{}
        interface Internal extends External {}
        interface Create extends External{}
        interface Update extends External{}
    }
    @JsonView(value = {FirmDTO.View.Internal.class})
    private Long firmId;
    @Size(groups = {FirmDTO.View.Create.class,FirmDTO.View.Update.class},min = 5, max =50,message = "Firm Name must be 5 to 25 characters")
    @NotBlank(groups = {FirmDTO.View.Create.class},message = "Firm Name Cannot Be Blank")
    @JsonView(value = {FirmDTO.View.Create.class,FirmDTO.View.Update.class,FirmDTO.View.External.class})
    private String firmName;
    @JsonView(value = {FirmDTO.View.External.class})
    private String logoUrl;
    @Email(groups = {FirmDTO.View.Update.class,FirmDTO.View.Create.class},message = "Email is invalid")
    @Size(groups = {FirmDTO.View.Create.class,FirmDTO.View.Update.class},min=5,max = 50,message = "email must be between 5 to 50 characters")
    @JsonView(value = {FirmDTO.View.External.class})
    private String email;
    @JsonView(value = {FirmDTO.View.External.class})
    @Pattern(groups = {FirmDTO.View.Update.class, FirmDTO.View.Create.class},
            regexp = "^$|^[0-9a-zA-Z]{15}$",
            message = "GST number is invalid")
    private String gstNumber;
    @Pattern(groups = {FirmDTO.View.Update.class, FirmDTO.View.Create.class},
            regexp = "^$|^[0-9]{10}$",
            message = "Mobile Number must be exactly 10 digits")
    @JsonView(value = {FirmDTO.View.External.class})
    private String mobileNumber;
    @Pattern(groups = {FirmDTO.View.Update.class, FirmDTO.View.Create.class},
            regexp = "^$|^[0-9]{10}$",
            message = "Alternate Mobile Number must be exactly 10 digits")
    @JsonView(value = {FirmDTO.View.External.class})
    private String altMobileNumber;
    @JsonView(value = {FirmDTO.View.External.class})
    private BankDTO bank;
    @JsonView(value = {FirmDTO.View.External.class})
    private AddressDTO address;

}
