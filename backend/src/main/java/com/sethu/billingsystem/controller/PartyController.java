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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping(value = "/api/parties")
public class PartyController {

    @Autowired
    PartyService partyService;
    @PostMapping("/new")
    @JsonView(PartyDTO.View.Internal.class)
    private ResponseEntity<ApiResponse<Object>> createNewParty(@RequestParam String firmName, @RequestParam String userName, @RequestBody @JsonView(value = {PartyDTO.View.External.class}) @Valid PartyDTO requestBody){
       return partyService.createParty(firmName,userName,requestBody);
    }
    @PatchMapping("/update")
    @JsonView(PartyDTO.View.Internal.class)
    private ResponseEntity<ApiResponse<Object>> updateParty(@RequestParam String userName, @RequestParam String firmName, @RequestParam String partyName, @RequestBody @JsonView(value = {PartyDTO.View.External.class}) @Valid PartyDTO requestBody){
        return partyService.updateParty(userName,firmName,partyName,requestBody);
    }

    @GetMapping("/details")
    @JsonView(PartyDTO.View.Internal.class)
    private ResponseEntity<ApiResponse<Object>> partyDetails(@RequestParam String userName, @RequestParam String firmName, @RequestParam String partyName){
        return partyService.getPartyDetails(userName,firmName,partyName);
    }

    @GetMapping("/all")
    @JsonView(PartyDTO.View.Internal.class)
    private ResponseEntity<ApiResponse<Object>> getAllParties(@RequestParam String userName,@RequestParam String firmName){
        return partyService.getAllParties(userName,firmName);
    }

}
