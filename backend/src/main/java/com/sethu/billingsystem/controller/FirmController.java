package com.sethu.billingsystem.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.sethu.billingsystem.dto.FirmDTO;
import com.sethu.billingsystem.model.ApiResponse;
import com.sethu.billingsystem.model.Firm;
import com.sethu.billingsystem.service.FirmService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;


@RestController
@Validated
@RequestMapping(value = "/api/firms")
public class FirmController {
    Logger logger = LoggerFactory.getLogger(FirmController.class);
    @Autowired
    FirmService firmService;
    @Autowired
    ModelMapper modelMapper;
    @PostMapping("/new")
    @JsonView(FirmDTO.View.External.class)
    public ResponseEntity<ApiResponse<Object>> createFirm(@RequestParam(required = true) String userName, @RequestBody @Valid FirmDTO requestBody){
        logger.info("create Firm : userName : {} ; requestBody : {}",userName,requestBody);
        return firmService.createFirm(requestBody,userName);
    }
    @GetMapping("/details")
    @JsonView(FirmDTO.View.External.class)
    public ResponseEntity<ApiResponse<Object>> getFirmDetails(@RequestParam(required = true) String userName)
    {
        return firmService.getFirmDetails(userName);
    }

    @PatchMapping("/update")
    @JsonView(FirmDTO.View.External.class)
    public ResponseEntity<ApiResponse<Object>> updateFirm(@RequestParam(required = true) String userName,@RequestBody  @Valid FirmDTO requestBody)
    {
       return firmService.updateFirm(requestBody,userName);
    }

}
