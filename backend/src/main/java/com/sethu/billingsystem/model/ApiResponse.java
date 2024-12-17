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
    private Integer pageNum;
    @JsonView(value = ResponseDTO.View.Public.class)
    private Long totalCount;
    @JsonView(value = ResponseDTO.View.Public.class)
    private Integer pageSize;
    @JsonView(value = ResponseDTO.View.Public.class)
    private Integer totalPages;
    @JsonView(value = ResponseDTO.View.Public.class)
    private T data;
    public ApiResponse(boolean status, String message, T data) {
        this.success = status;
        this.message = message;
        this.data = data;
    }
    public ApiResponse(boolean status, String message, T data,Integer pageNum,Integer pageSize,Long totalCount,Integer totalPages) {
        this.success = status;
        this.message = message;
        this.data = data;
        this.pageNum = pageNum;
        this.pageSize = pageSize;
        this.totalCount = totalCount;
        this.totalPages = totalPages;
    }
}
