package com.sethu.billingsystem.model;

import com.fasterxml.jackson.annotation.JsonView;
import com.sethu.billingsystem.dto.ResponseDTO;
import com.sethu.billingsystem.dto.UserDTO;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ApiResponse<T>
{
    @JsonView(value = ResponseDTO.View.Public.class)
    private boolean success;
    @JsonView(value = ResponseDTO.View.Public.class)
    private String message;
    @JsonView(value = ResponseDTO.View.Public.class)
    private T data;
    public ApiResponse(boolean status, String message, T data) {
        this.success = status;
        this.message = message;
        this.data = data;
    }
}
