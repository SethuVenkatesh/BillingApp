package com.sethu.billingsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;




    @Data
    public class PartyDTO {
        public interface View {
            interface External extends ResponseDTO.View.Public,AddressDTO.View.External,BankDTO.View.External{}
            interface Internal extends External {}
        }
        @JsonView(value = {PartyDTO.View.Internal.class})
        private Long partyId;
        @Size(min = 5, max = 25,message = "Party Name must be between 5 to 25 characters")
        @JsonView(value = {PartyDTO.View.External.class})
        private String partyName;
        @JsonView(value = {PartyDTO.View.External.class})
        private String logoUrl;
        @Email(message = "Email is invalid")
        @JsonView(value = {PartyDTO.View.External.class})
        private String email;
        @JsonView(value = {PartyDTO.View.External.class})
        private String gstNumber;
        @Size(min = 10,max = 10,message = "Mobile Number is invalid")
        @JsonView(value = {PartyDTO.View.External.class})
        private String mobileNumber;
        @Size(min = 10,max = 10,message = "Mobile Number is invalid")
        @JsonView(value = {PartyDTO.View.External.class})
        private String altMobileNumber;
        @JsonView(value = {PartyDTO.View.External.class})
        private BankDTO bank;
        @JsonView(value = {PartyDTO.View.External.class})
        private AddressDTO address;
    }


