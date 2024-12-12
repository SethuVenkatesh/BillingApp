package com.sethu.billingsystem.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.sethu.billingsystem.dto.PartyDTO;
import com.sethu.billingsystem.dto.UserDTO;
import com.sethu.billingsystem.model.ApiResponse;
import com.sethu.billingsystem.service.PartyService;
import jakarta.validation.Valid;
import jakarta.websocket.OnClose;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Controller
@RequestMapping(value = "/api/parties")
public class PartyController {

    @Autowired
    PartyService partyService;
    @PostMapping("/new")
    @JsonView(PartyDTO.View.External.class)
    private ResponseEntity<ApiResponse<Object>> createNewParty(@RequestPart("partyDetails") @Validated(value = {PartyDTO.View.Create.class}) @JsonView(value = {PartyDTO.View.Create.class}) PartyDTO requestBody,@RequestPart(value = "partyImage",required = false) MultipartFile partyImage){
       return partyService.createParty(requestBody,partyImage);
    }
    @PatchMapping("/update")
    @JsonView(PartyDTO.View.External.class)
    private ResponseEntity<ApiResponse<Object>> updateParty(@RequestParam String partyName, @RequestPart("partyDetails") @Validated(value = {PartyDTO.View.Update.class}) @JsonView(value = {PartyDTO.View.Update.class}) PartyDTO requestBody, @RequestPart(value = "partyImage",required = false) MultipartFile image){
        return partyService.updateParty(partyName,requestBody,image);
    }

    @GetMapping("/details")
    @JsonView(PartyDTO.View.External.class)
    private ResponseEntity<ApiResponse<Object>> partyDetails(@RequestParam String partyName){
        return partyService.getPartyDetails(partyName);
    }


    @GetMapping("/lists")
    @JsonView(PartyDTO.View.External.class)
    private ResponseEntity<ApiResponse<Object>> getPartyLists(@RequestParam(required = true) String partyName){
        return partyService.getPartyLists(partyName);
    }

    @GetMapping("/all")
    @JsonView(PartyDTO.View.External.class)
    private ResponseEntity<ApiResponse<Object>> getAllParties(@RequestParam(required = false,defaultValue = "1") Integer pageNum, @RequestParam(required = false,defaultValue = "20") Integer pageSize, @RequestParam(required = false,defaultValue = "desc") String sortType, @RequestParam(required = false,defaultValue = "createdAt") String sortKey, @RequestParam(required = false,defaultValue = "") String partyName){
        return partyService.getAllParties(pageNum,pageSize,sortType,sortKey,partyName);
    }

    @DeleteMapping ("/delete")  
    @JsonView(PartyDTO.View.External.class)
    private ResponseEntity<ApiResponse<Object>> deleteParty(@RequestParam String partyName){
        return partyService.deleteParty(partyName);
    }

}
