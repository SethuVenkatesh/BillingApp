package com.sethu.billingsystem.dto;


import com.fasterxml.jackson.annotation.JsonView;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @Size(groups = {InvoicePartyDTO.View.Create.class,InvoicePartyDTO.View.Update.class,InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},min = 5, max = 100,message = "Party Name must be between 5 to 100 characters")
    @NotBlank(groups = {InvoicePartyDTO.View.Create.class,InvoiceDTO.View.Create.class},message = "Party Name Cannot Be Blank")
    @JsonView(value = {InvoicePartyDTO.View.External.class})
    private String partyName;
    @Email(groups ={InvoicePartyDTO.View.Update.class,InvoicePartyDTO.View.Create.class,InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class}, message = "Party Email is invalid")
    @Size(groups = {InvoicePartyDTO.View.Create.class,InvoicePartyDTO.View.Update.class,InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},min = 5, max = 50,message = "Party Mail must be between 5 to 50 characters")
    @JsonView(value = {InvoicePartyDTO.View.External.class})
    private String email;
    @Size(groups = {InvoicePartyDTO.View.Create.class,InvoicePartyDTO.View.Update.class},min = 15,max = 15,message = "GST number must be 15 characters")
    @JsonView(value = {InvoicePartyDTO.View.External.class})
    private String gstNumber;
    @NotBlank(groups ={InvoicePartyDTO.View.Update.class,InvoicePartyDTO.View.Create.class,InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},message = "Party Mobile Number cannot be blank")

    @Size(groups ={InvoicePartyDTO.View.Update.class,InvoicePartyDTO.View.Create.class,InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},min = 10,max = 10,message = "Party Mobile Number is invalid")
    @JsonView(value = {InvoicePartyDTO.View.External.class})
    private String mobileNumber;
    @Size(groups ={InvoicePartyDTO.View.Update.class,InvoicePartyDTO.View.Create.class},min = 10,max = 10,message = "Party Alternate Mobile Number is invalid")
    @JsonView(value = {InvoicePartyDTO.View.External.class})
    private String altMobileNumber;
    @NotNull(groups = {InvoicePaymentDTO.View.Create.class},message = "address cannot be null")
    @JsonView(value = {InvoicePartyDTO.View.External.class})
    @Valid
    private AddressDTO address;
}
