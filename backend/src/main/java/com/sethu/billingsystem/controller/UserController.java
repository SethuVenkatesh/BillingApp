package com.sethu.billingsystem.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.sethu.billingsystem.dto.AuthRequest;
import com.sethu.billingsystem.dto.UserDTO;
import com.sethu.billingsystem.mapper.UserMapper;
import com.sethu.billingsystem.model.ApiResponse;
import com.sethu.billingsystem.model.Customer;
import com.sethu.billingsystem.service.UserService;
import com.sethu.billingsystem.utils.CommonUtil;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(value = "/api/users",method = RequestMethod.POST)
@Validated
public class UserController {
    Logger logger = LoggerFactory.getLogger(UserController.class);
    @Autowired
    UserService userService;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    CommonUtil util;
    @PostMapping("/auth/new")
    @JsonView(UserDTO.View.Details.class)
    public ResponseEntity<ApiResponse<Object>> createUser(@RequestBody @Validated(value = {UserDTO.View.Create.class}) @JsonView(value = {UserDTO.View.Create.class}) UserDTO requestBody){
        logger.info("Request Body {}",requestBody);
        return userService.createUser(requestBody);
    }
    @GetMapping("/details")
    @JsonView(UserDTO.View.Details.class)
    public ResponseEntity<ApiResponse<Object>> getUserDetails(){
        return userService.getUserDetails();
    }

    @PatchMapping("/update")
    @JsonView(UserDTO.View.Details.class)
    public ResponseEntity<ApiResponse<Object>> updateUserDetails(@RequestBody @Validated(value = {UserDTO.View.Update.class}) @JsonView(value = {UserDTO.View.Update.class}) UserDTO requestBody){
        return userService.updateUserDetails(requestBody);
    }

    @PostMapping("/auth/login")
    @JsonView(UserDTO.View.Details.class)
    public ResponseEntity<ApiResponse<Object>> login(@RequestBody @Valid AuthRequest requestBody){
        logger.info("Request Body {}",requestBody);
        return userService.loginUser(requestBody);
    }

    @GetMapping("/auth/api_login")
    @JsonView(UserDTO.View.Details.class)
    public ResponseEntity<ApiResponse<Object>> apiLogin(){
        ResponseEntity<ApiResponse<Object>> response = userService.getUserDetails();
        return response;
    }



}
