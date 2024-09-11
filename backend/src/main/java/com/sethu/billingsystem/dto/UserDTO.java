package com.sethu.billingsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserDTO {
    public interface View {
        interface External extends ResponseDTO.View.Public {}
        interface Internal extends External {}
    }
    @JsonView(value = UserDTO.View.External.class )
    @NotBlank(message = "User Name cannot be blank")
    @Size(min = 5, max = 25,message = "User Name must be 5 and 25 characters")
    private String userName;
    @JsonView(value = UserDTO.View.Internal.class)
    @NotBlank(message = "Password cannot be blank")
    private String password;
    @JsonView(value = UserDTO.View.External.class )
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email Id is invalid")
    private String email;
    @JsonView(value = UserDTO.View.External.class )
    private String profileUrl;
}


