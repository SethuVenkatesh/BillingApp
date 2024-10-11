package com.sethu.billingsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserDTO {
    public interface View {
        interface Details extends ResponseDTO.View.Public{}
        interface Create extends Details {}
        interface  Update {}
    }
    @JsonView(value = {UserDTO.View.Details.class})
    @NotBlank(groups = {UserDTO.View.Details.class},message = "User Name cannot be blank")
    @Size(groups = {UserDTO.View.Details.class},min = 5, max = 25,message = "User Name must be 5 and 25 characters")
    private String userName;
    @JsonView(value = {UserDTO.View.Create.class})
    @NotBlank(groups = {UserDTO.View.Create.class},message = "Password cannot be blank")
    @Size(groups = {UserDTO.View.Create.class},min = 5, max = 25,message = "Password must be 5 and 25 characters")
    private String password;
    @JsonView(value = {UserDTO.View.Details.class,UserDTO.View.Update.class})
    @NotBlank(groups = {UserDTO.View.Details.class},message = "Email cannot be blank")
    @Email(groups = {UserDTO.View.Update.class,UserDTO.View.Details.class},message = "Email Id is invalid")
    private String email;
    @JsonView(value = {UserDTO.View.Details.class,UserDTO.View.Update.class})
    @NotBlank(groups = {UserDTO.View.Details.class},message = "Profile Url cannot be blank")
    private String profileUrl;
}


