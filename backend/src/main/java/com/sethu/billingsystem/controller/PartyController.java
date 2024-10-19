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

import java.util.List;

@Controller
@RequestMapping(value = "/api/parties")
public class PartyController {

    @Autowired
    PartyService partyService;
    @PostMapping("/new")
    @JsonView(PartyDTO.View.External.class)
    private ResponseEntity<ApiResponse<Object>> createNewParty(@RequestBody @Validated(value = {PartyDTO.View.Create.class}) @JsonView(value = {PartyDTO.View.Create.class}) PartyDTO requestBody){
       return partyService.createParty(requestBody);
    }
    @PatchMapping("/update")
    @JsonView(PartyDTO.View.External.class)
    private ResponseEntity<ApiResponse<Object>> updateParty(@RequestParam String partyName, @RequestBody @Validated(value = {PartyDTO.View.Update.class}) @JsonView(value = {PartyDTO.View.Update.class}) PartyDTO requestBody){
        return partyService.updateParty(partyName,requestBody);
    }

    @GetMapping("/details")
    @JsonView(PartyDTO.View.External.class)
    private ResponseEntity<ApiResponse<Object>> partyDetails(@RequestParam String partyName){
        return partyService.getPartyDetails(partyName);
    }

    @GetMapping("/all")
    @JsonView(PartyDTO.View.External.class)
    private ResponseEntity<ApiResponse<Object>> getAllParties(){
        return partyService.getAllParties();
    }

    @DeleteMapping ("delete")
    @JsonView(PartyDTO.View.External.class)
    private ResponseEntity<ApiResponse<Object>> deleteParty(@RequestParam String partyName){
        return partyService.deleteParty(partyName);
    }

}
