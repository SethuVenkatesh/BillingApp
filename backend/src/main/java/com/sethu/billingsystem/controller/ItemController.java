package com.sethu.billingsystem.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.sethu.billingsystem.dto.FirmDTO;
import com.sethu.billingsystem.dto.ItemDTO;
import com.sethu.billingsystem.model.ApiResponse;
import com.sethu.billingsystem.model.Firm;
import com.sethu.billingsystem.model.Party;
import com.sethu.billingsystem.repository.FirmRepository;
import com.sethu.billingsystem.repository.PartyRepository;
import com.sethu.billingsystem.repository.UserRepository;
import com.sethu.billingsystem.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping(value = "/api/items")
public class ItemController {

    @Autowired
    ItemService itemService;

    @GetMapping(value="/all_party_items")
    @JsonView(ItemDTO.View.External.class)
    private ResponseEntity<ApiResponse<Object>> getAllPartyItems(@RequestParam String userName, @RequestParam String firmName, @RequestParam String partyName){
        return itemService.getAllPartyItems(userName,firmName,partyName);
    }

    @GetMapping(value = "/all")
    @JsonView(ItemDTO.View.External.class)
    private ResponseEntity<ApiResponse<Object>> getAllItems(@RequestParam String userName,@RequestParam String firmName){
        return itemService.getAllItems(userName,firmName);
    }
    @PostMapping(value = "/new")
    @JsonView(ItemDTO.View.External.class)
    private ResponseEntity<ApiResponse<Object>> createNewItem(@RequestParam String userName,@RequestParam String firmName,@RequestParam String partyName,@RequestBody @JsonView(value = {ItemDTO.View.External.class}) @Valid ItemDTO requestBody){
        return itemService.createNewItem(userName,firmName,partyName,requestBody);
    }

    @PatchMapping(value = "/update")
    @JsonView(ItemDTO.View.External.class)
    private ResponseEntity<ApiResponse<Object>> updateItem(@RequestParam String userName,@RequestParam String firmName,@RequestParam String partyName,@RequestParam String itemName,@RequestBody @JsonView(value = {ItemDTO.View.External.class}) @Valid ItemDTO requestBody){
        return itemService.updateItem(userName,firmName,partyName,itemName,requestBody);
    }
}
