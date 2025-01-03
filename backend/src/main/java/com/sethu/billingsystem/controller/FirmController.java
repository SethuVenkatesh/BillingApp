package com.sethu.billingsystem.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.sethu.billingsystem.dto.FirmDTO;
import com.sethu.billingsystem.model.ApiResponse;
import com.sethu.billingsystem.service.FirmService;
import com.sethu.billingsystem.service.ImageUpload;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@RestController
@Validated
@RequestMapping(value = "/api/firms")
public class FirmController {
    Logger logger = LoggerFactory.getLogger(FirmController.class);
    @Autowired
    ImageUpload imageService;
    @Autowired
    FirmService firmService;
    @Autowired
    ModelMapper modelMapper;
    @PostMapping(value = "/new",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @JsonView(FirmDTO.View.External.class)
    public ResponseEntity<ApiResponse<Object>> createFirm(@RequestPart("firmDetails") @Validated(value = {FirmDTO.View.Create.class}) @JsonView(value = {FirmDTO.View.Create.class}) FirmDTO requestBody, @RequestPart(value = "firmImage",required = false) MultipartFile firmImage){
        return firmService.createFirm(requestBody,firmImage);
    }
    @GetMapping("/details")
    @JsonView(FirmDTO.View.External.class)
    public ResponseEntity<ApiResponse<Object>> getFirmDetails()
    {
        return firmService.getFirmDetails();
    }

    @PatchMapping(value = "/update",consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @JsonView(FirmDTO.View.External.class)
    public ResponseEntity<ApiResponse<Object>> updateFirm(@RequestPart(value = "firmImage",required = false) MultipartFile firmImage,@RequestPart("firmDetails") @Validated(value = FirmDTO.View.Update.class) @JsonView(value = {FirmDTO.View.Update.class})  FirmDTO requestBody)
    {
       return firmService.updateFirm(requestBody,firmImage);
    }



}
