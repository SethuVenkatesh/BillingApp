package com.sethu.billingsystem.dto;

import com.fasterxml.jackson.annotation.JsonView;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AuthRequest {
    @NotBlank(message = "Username cannot be blank")
    @Size(min = 5, max = 25,message = "Username must between 5 to 25 characters")
    private String userName;
    @NotBlank(message = "Password cannot be blank")
    private String password;
}
