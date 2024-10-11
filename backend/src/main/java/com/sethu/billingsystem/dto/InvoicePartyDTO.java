package com.sethu.billingsystem.dto;


import com.fasterxml.jackson.annotation.JsonView;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class InvoicePartyDTO {
    public interface View {
        interface External extends ResponseDTO.View.Public,AddressDTO.View.External,BankDTO.View.External{}
        interface Internal extends PartyDTO.View.External {}
        interface Create extends PartyDTO.View.External {}
        interface Update extends PartyDTO.View.External {}
    }

    @Size(groups = {InvoicePartyDTO.View.Create.class,InvoicePartyDTO.View.Update.class},min = 5, max = 25,message = "Party Name must be between 5 to 25 characters")
    @NotBlank(groups = {InvoicePartyDTO.View.Create.class},message = "Party Name Cannot Be Blank")
    @JsonView(value = {InvoicePartyDTO.View.External.class})
    private String partyName;
    @Email(groups ={InvoicePartyDTO.View.Update.class,InvoicePartyDTO.View.Create.class}, message = "Email is invalid")
    @JsonView(value = {InvoicePartyDTO.View.External.class})
    private String email;
    @JsonView(value = {InvoicePartyDTO.View.External.class})
    private String gstNumber;
    @Size(groups ={InvoicePartyDTO.View.Update.class,InvoicePartyDTO.View.Create.class},min = 10,max = 10,message = "Mobile Number is invalid")
    @JsonView(value = {InvoicePartyDTO.View.External.class})
    private String mobileNumber;
    @Size(groups ={InvoicePartyDTO.View.Update.class,InvoicePartyDTO.View.Create.class},min = 10,max = 10,message = "Mobile Number is invalid")
    @JsonView(value = {InvoicePartyDTO.View.External.class})
    private String altMobileNumber;
    @JsonView(value = {InvoicePartyDTO.View.External.class})
    private BankDTO bank;
    @JsonView(value = {InvoicePartyDTO.View.External.class})
    private AddressDTO address;
}
