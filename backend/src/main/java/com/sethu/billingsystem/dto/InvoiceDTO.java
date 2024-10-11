package com.sethu.billingsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;
import com.sethu.billingsystem.constants.PaymentStage;
import com.sethu.billingsystem.model.InvoiceParty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

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
    @NotNull(groups = {InvoiceDTO.View.Create.class},message = "Invoice Date Cannot be blank")
    private Date invoiceDate;
    @JsonView(value = {InvoiceDTO.View.External.class})
    private PaymentStage paymentStatus;
    @JsonView(value = {InvoiceDTO.View.External.class})
    private Boolean includeGst;
    @JsonView(value = {InvoiceDTO.View.External.class})
    private Long cgstPer;
    @JsonView(value = {InvoiceDTO.View.External.class})
    private Long sgstPer;
    @JsonView(value = {InvoiceDTO.View.External.class})
    private Long cgstPrice;
    @JsonView(value = {InvoiceDTO.View.External.class})
    private Long sgstPrice;
    @JsonView(value = {InvoiceDTO.View.External.class})
    private Long totalPrice;
    @JsonView(value = {InvoiceDTO.View.External.class})
    private Long subtotalPrice;
    @JsonView(value = {InvoiceDTO.View.External.class})
    @NotNull(groups = {InvoiceDTO.View.Create.class},message = "Invoice Party Cannot be blank")
    private InvoicePartyDTO invoiceParty;
    @JsonView(value = {InvoiceDTO.View.External.class})
    @NotNull(groups = {InvoiceDTO.View.Create.class},message = "Invoice Items Cannot be blank")
    private List<InvoiceItemDTO> invoiceItems;

}
