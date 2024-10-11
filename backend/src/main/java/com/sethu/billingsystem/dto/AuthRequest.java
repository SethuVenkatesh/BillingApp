package com.sethu.billingsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AuthRequest {
    @Size(min = 5, max = 25,message = "User Name must be 5 and 25 characters")
    @NotBlank(message = "Username cannot be blank")
    private String userName;
    @NotBlank(message = "Password cannot be blank")
    private String password;
}
