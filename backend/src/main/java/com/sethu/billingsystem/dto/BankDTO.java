package com.sethu.billingsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BankDTO {
    public interface View {
        interface External {}
        interface Internal extends External {}


    }
    @JsonView(value = {View.Internal.class})
    private Long bankId;
    @Size(min = 5, max = 25,message = "Bank Name must be 5 and 25 characters")
    @JsonView(value = {View.External.class})
    private String bankName;
    @Size(min = 10, max = 25,message = "Account Number must between 10 and 25 characters")
    @JsonView(value = {View.External.class})
    private Long accountNumber;
    @Size(min = 5, max = 25,message = "Branch name must between 5 and 25 characters")
    @JsonView(value = {View.External.class})
    private String branch;
    @Size(min = 5, max = 25,message = "Ifsc Code must between 5 and 25 characters")
    @JsonView(value = {View.External.class})
    private String ifscCode;
}
