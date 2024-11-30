package com.sethu.billingsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;
import com.sethu.billingsystem.constants.PaymentStage;
import com.sethu.billingsystem.model.InvoiceParty;
import jakarta.persistence.Column;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.validation.annotation.Validated;

import java.math.BigDecimal;
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
    @NotNull(groups = {InvoiceDTO.View.Create.class},message = "GST Details Cannot be blank")
    private Boolean includeGst;
    @NotNull(groups = {InvoiceDTO.View.Create.class},message = "CGST Percentage Cannot be blank")
    @DecimalMin(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = "0.00",message = "CGST Percentage has to be more than or equal to 0")
    @DecimalMax(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = "30.00",message = "CGST Percentage has to be less than 30")
    @Digits(integer = 2,fraction = 2,message = "CGST Percentage must be 4 digits with max of 2 decimal points")
    @JsonView(value = {InvoiceDTO.View.External.class})
    private BigDecimal cgstPer;
    @NotNull(groups = {InvoiceDTO.View.Create.class},message = "SGST Percentage Cannot be blank")
    @DecimalMin(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = "0.00",message = "SGST Percentage has to be more than or equal to 0")
    @DecimalMax(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = "30.00",message = "SGST Percentage has to be less than 30")
    @Digits(integer = 2,fraction = 2,message = "SGST Percentage must be 4 digits with max of 2 decimal points")
    @JsonView(value = {InvoiceDTO.View.External.class})
    private BigDecimal sgstPer;
    @NotNull(groups = {InvoiceDTO.View.Create.class},message = "CGST Price Cannot be blank")
    @DecimalMin(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = "0.00",message = "CGST price must be greater than 00.00")
    @DecimalMax(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = "99999999.99",message = "CGST price must be lesser than 99999999.99")
    @Digits(integer = 8,fraction = 2,message = "CGST Price must be 10 digits with max of 2 decimal points")
    @JsonView(value = {InvoiceDTO.View.External.class})
    private BigDecimal cgstPrice;
    @NotNull(groups = {InvoiceDTO.View.Create.class},message = "SGST Price Cannot be blank")
    @DecimalMin(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = "0.00",message = "SGST price must be greater than 00.00")
    @DecimalMax(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = "99999999.99",message = "SGST price must be lesser than 99999999.99")
    @Digits(integer = 8,fraction = 2,message = "CGST Price must be 10 digits with max of 2 decimal points")
    @JsonView(value = {InvoiceDTO.View.External.class})
    private BigDecimal sgstPrice;
    @NotNull(groups = {InvoiceDTO.View.Create.class},message = "total Price Cannot be blank")
    @DecimalMin(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = "1.00",message = "total price must be greater than 1.00")
    @DecimalMax(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = "99999999.99",message = "total price must be lesser than 99999999.99")
    @Digits(integer = 8,fraction = 2,message = "total Price must be 10 digits with max of 2 decimal points")
    @JsonView(value = {InvoiceDTO.View.External.class})
    private BigDecimal totalPrice;
    @NotNull(groups = {InvoiceDTO.View.Create.class},message = "subtotal price cannot be blank")
    @DecimalMin(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = "1.00",message = "subtotal price must be greater than 1.00")
    @DecimalMax(groups = {InvoiceDTO.View.Create.class,InvoiceDTO.View.Update.class},value = "99999999.99",message = "subtotal price must be lesser than 99999999.99")
    @Digits(integer = 8,fraction = 2,message = "subtotal Price must be 10 digits with max of 2 decimal points")
    @JsonView(value = {InvoiceDTO.View.External.class})
    private BigDecimal subtotalPrice;
    @JsonView(value = {InvoiceDTO.View.External.class})
    @NotNull(groups = {InvoiceDTO.View.Create.class},message = "Invoice Party Cannot be null")
    @Valid
    private InvoicePartyDTO invoiceParty;
    @JsonView(value = {InvoiceDTO.View.External.class})
    @NotNull(groups = {InvoiceDTO.View.Create.class},message = "Invoice Items Cannot be null")
    @Valid
    private List<InvoiceItemDTO> invoiceItems;

}
