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
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@Controller
@RequestMapping(value = "/api/items")
public class ItemController {
    @Autowired
    ItemService itemService;
    @GetMapping(value="/all_party_items")
    @JsonView(ItemDTO.View.External.class)
    private ResponseEntity<ApiResponse<Object>> getAllPartyItems(@RequestParam String partyName){
        return itemService.getAllPartyItems(partyName);
    }

    @GetMapping(value = "/all")
    @JsonView(ItemDTO.View.External.class)
    private ResponseEntity<ApiResponse<Object>> getAllItems(@RequestParam(required = false,defaultValue = "1") Integer pageNum, @RequestParam(required = false,defaultValue = "20") Integer pageSize, @RequestParam(required = false,defaultValue = "desc") String sortType, @RequestParam(required = false,defaultValue = "createdAt") String sortKey, @RequestParam(required = false,defaultValue = "0") BigDecimal minPrice,@RequestParam(required = false,defaultValue = "1000000") BigDecimal maxPrice,@RequestParam(required = false,defaultValue = "") String itemName,@RequestParam(required = false,defaultValue = "") String partyName){
        return itemService.getAllItems(pageNum,pageSize,sortType,sortKey,minPrice,maxPrice,itemName,partyName);
    }
    @PostMapping(value = "/new")
    @JsonView(ItemDTO.View.External.class)
    private ResponseEntity<ApiResponse<Object>> createNewItem(@RequestParam String partyName,@RequestBody @Validated(value = {ItemDTO.View.Create.class}) @JsonView(value = {ItemDTO.View.Create.class})  ItemDTO requestBody){
        return itemService.createNewItem(partyName,requestBody);
    }

    @PatchMapping(value = "/update")
    @JsonView(ItemDTO.View.External.class)
    private ResponseEntity<ApiResponse<Object>> updateItem(@RequestParam String partyName,@RequestParam String itemName,@RequestBody @Validated(value = {ItemDTO.View.Update.class})  @JsonView(value = {ItemDTO.View.Update.class})  ItemDTO requestBody){
         return itemService.updateItem(partyName,itemName,requestBody);
    }

    @DeleteMapping("/delete")
    private ResponseEntity<ApiResponse<Object>> deleteItem(@RequestParam String itemName,@RequestParam String partyName){
        return itemService.deleteItem(itemName,partyName);
    }
}
