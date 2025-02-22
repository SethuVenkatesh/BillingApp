package com.sethu.billingsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDateTime;


@Data
    public class PartyDTO {
        public interface View {
            interface External extends ResponseDTO.View.Public,AddressDTO.View.External,BankDTO.View.External{}
            interface Internal extends External {}
            interface Create extends External{}
            interface Update extends External{}
        }
        @JsonView(value = {PartyDTO.View.Internal.class})
        private Long partyId;
        @Size(groups = {PartyDTO.View.Create.class,PartyDTO.View.Update.class},min = 5, max = 100,message = "Party Name must be between 5 to 100 characters")
        @NotBlank(groups = {PartyDTO.View.Create.class},message = "Party Name Cannot Be Blank")
        @JsonView(value = {PartyDTO.View.External.class})
        private String partyName;
        @JsonView(value = {PartyDTO.View.External.class})
        private String logoUrl;
        @NotBlank(groups = {PartyDTO.View.Create.class},message = "Email Cannot Be Blank")
        @Email(groups ={PartyDTO.View.Update.class,PartyDTO.View.Create.class}, message = "Email is invalid")
        @Size(groups = {PartyDTO.View.Create.class,PartyDTO.View.Update.class},max = 50,min = 5,message = "email must be between 5 to 50 characters")
        @JsonView(value = {PartyDTO.View.External.class})
        private String email;
        @JsonView(value = {PartyDTO.View.External.class})
        @Pattern(groups = {PartyDTO.View.Update.class, PartyDTO.View.Create.class},
                regexp = "^$|^[0-9a-zA-Z]{15}$",
                message = "GST number is invalid")
        private String gstNumber;
        @NotBlank(groups = {PartyDTO.View.Create.class},message = "Mobile Number Cannot Be Blank")
        @Pattern(groups = {PartyDTO.View.Update.class, PartyDTO.View.Create.class},
                regexp = "^$|^[0-9]{10}$",
                message = "Mobile Number must be exactly 10 digits")
        @JsonView(value = {PartyDTO.View.External.class})
        private String mobileNumber;
        @Pattern(groups = {PartyDTO.View.Update.class, PartyDTO.View.Create.class},
            regexp = "^$|^[0-9]{10}$",
            message = "Alternate Mobile Number must be exactly 10 digits")
        @JsonView(value = {PartyDTO.View.External.class})
        private String altMobileNumber;
        @JsonView(value = {PartyDTO.View.External.class})
        private LocalDateTime createdAt;
        @JsonView(value = {PartyDTO.View.External.class})
        private BankDTO bank;
        @JsonView(value = {PartyDTO.View.External.class})
        private AddressDTO address;
    }


