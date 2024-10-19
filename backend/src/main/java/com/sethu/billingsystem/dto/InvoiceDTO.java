package com.sethu.billingsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;
import com.sethu.billingsystem.constants.PaymentStage;
import com.sethu.billingsystem.model.InvoiceParty;
import jakarta.persistence.Column;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.validation.annotation.Validated;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Data
public class InvoiceDTO {

    public interface View{
        interface External extends ResponseDTO.View.Public,InvoicePartyDTO.View.External,InvoiceItemDTO.View.External{};
        interface Internal extends External{};
        interface Create extends External{};
        interface Update extends External{};
    }
    @JsonView(value = {InvoiceDTO.View.Internal.class})
    private Long invoiceId;
    @JsonView(value = {InvoiceDTO.View.External.class})
    private Long invoiceNumber;
    @JsonView(value = {InvoiceDTO.View.External.class})
    @NotNull(groups = {InvoiceDTO.View.Create.class},message = "Invoice Date Cannot be blank")
    private Date invoiceDate;
    @JsonView(value = {InvoiceDTO.View.External.class})
    private PaymentStage paymentStatus;
    @JsonView(value = {InvoiceDTO.View.External.class})
    private Boolean includeGst;
    @Min(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = 1,message = "CGST Percentage has to be more than 0")
    @Max(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = 30,message = "CGST Percentage has to be less than 30")
    @JsonView(value = {InvoiceDTO.View.External.class})
    private Long cgstPer;
    @Min(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = 1,message = "SGST Percentage has to be more than 0")
    @Max(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = 30,message = "SGST Percentage has to be less than 30")
    @JsonView(value = {InvoiceDTO.View.External.class})
    private Long sgstPer;
    @Min(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = 1,message = "CGST Price cannot be less than 1")
    @JsonView(value = {InvoiceDTO.View.External.class})
    private Long cgstPrice;
    @Min(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = 1,message = "SGST Price cannot be less than 1")
    @JsonView(value = {InvoiceDTO.View.External.class})
    private Long sgstPrice;
    @Min(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = 1,message = "Total Price cannot be less than 1")
    @JsonView(value = {InvoiceDTO.View.External.class})
    private Long totalPrice;
    @Min(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = 1,message = "SubTotal Price cannot be less than 1")
    @JsonView(value = {InvoiceDTO.View.External.class})
    private Long subtotalPrice;
    @JsonView(value = {InvoiceDTO.View.External.class})
    @NotNull(groups = {InvoiceDTO.View.Create.class},message = "Invoice Party Cannot be null")
    @Valid
    private InvoicePartyDTO invoiceParty;
    @JsonView(value = {InvoiceDTO.View.External.class})
    @NotNull(groups = {InvoiceDTO.View.Create.class},message = "Invoice Items Cannot be null")
    @Valid
    private List<InvoiceItemDTO> invoiceItems;

}
