package com.sethu.billingsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;


import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.math.BigInteger;

@Data
public class UserDTO {
    public interface View {
        interface Details extends ResponseDTO.View.Public{}
        interface Create extends Details {}
        interface  Update {}
    }
    @JsonView(value = {UserDTO.View.Details.class})
    @NotBlank(groups = {UserDTO.View.Create.class},message = "User Name cannot be blank")
    @Size(groups = {UserDTO.View.Create.class,UserDTO.View.Update.class},min = 5, max = 25,message = "User Name must be 5 to 25 characters")
    private String userName;
    @JsonView(value = {UserDTO.View.Create.class})
    @NotBlank(groups = {UserDTO.View.Create.class},message = "Password cannot be blank")
    @Size(groups = {UserDTO.View.Create.class},min = 5, max = 25,message = "Password must be 5 to 25 characters")
    private String password;
    @JsonView(value = {UserDTO.View.Details.class})
    @NotBlank(groups = {UserDTO.View.Create.class},message = "Mobile Number cannot be blank")
    @Pattern(groups = {UserDTO.View.Create.class,UserDTO.View.Update.class},regexp = "^\\d{10}$", message = "Mobile number must be 10 digits")
    private String mobileNumber;
    @JsonView(value = {UserDTO.View.Details.class,UserDTO.View.Update.class})
    @NotBlank(groups = {UserDTO.View.Create.class},message = "Email cannot be blank")
    @Size(groups = {UserDTO.View.Create.class,UserDTO.View.Update.class},max = 50,min = 5,message = "email must be between 5 to 50 characters")
    @Email(groups = {UserDTO.View.Update.class,UserDTO.View.Create.class},message = "Email Id is invalid")
    private String email;
    @JsonView(value = {UserDTO.View.Details.class})
    private String profileUrl;
}


