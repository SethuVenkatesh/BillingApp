package com.sethu.billingsystem.service;

import com.sethu.billingsystem.dto.ItemDTO;
import com.sethu.billingsystem.mapper.ItemMapper;
import com.sethu.billingsystem.model.*;
import com.sethu.billingsystem.repository.FirmRepository;
import com.sethu.billingsystem.repository.ItemRepository;
import com.sethu.billingsystem.repository.PartyRepository;
import com.sethu.billingsystem.repository.UserRepository;
import com.sethu.billingsystem.utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemService {
    @Autowired
    ItemRepository itemRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    FirmRepository firmRepository;
    @Autowired
    PartyRepository partyRepository;
    @Autowired
    ItemMapper itemMapper;
    @Autowired
    CommonUtil util;
    @Autowired
    UserUtil userUtil;
    @Autowired
    FirmUtil firmUtil;
    @Autowired
    PartyUtil partyUtil;
    @Autowired
    ItemUtil itemUtil;
    public ResponseEntity<ApiResponse<Object>> createNewItem(String userName, String firmName, String partyName, ItemDTO requestBody) {
        boolean isAllNull = util.isNullAllFields(requestBody);
        if(isAllNull){
            ApiResponse<Object> response =new  ApiResponse<>(false,"No Values to update",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if(!userUtil.checkUserExsist(userName)){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User not found",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Customer user = userUtil.getUserDetails(userName);
        if(!firmUtil.checkFirmExsist(user.getUserId())){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Dont have any firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Firm firm = firmUtil.getFirmDetails(user.getUserId());
        if(!firm.getFirmName().equals(firmName)){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User are not authorised to add party in this firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if(!partyUtil.checkPartyExsist(partyName, firmName)){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Party Not found",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Party party = partyUtil.getPartyDetails(partyName,firmName);
        if(itemUtil.checkItemExsist(requestBody.getItemName(),partyName)){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Item Name already found for party",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Item item = new Item();
        itemMapper.itemDTOTOItem(requestBody,item);
        item.setParty(party);
        Item savedItem = itemRepository.save(item);
        ItemDTO savedDTO = new ItemDTO();
        itemMapper.itemToItemDTO(savedItem,savedDTO);
        ApiResponse<Object> response = new ApiResponse<>(true,"Item created successfully",savedDTO);
        return new ResponseEntity<>(response,HttpStatus.CREATED);
    }
    public ResponseEntity<ApiResponse<Object>> updateItem(String userName, String firmName, String partyName,String itemName, ItemDTO requestBody) {
        boolean isAllNull = util.isNullAllFields(requestBody);
        if(isAllNull){
            ApiResponse<Object> response =new  ApiResponse<>(false,"No Values to update",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if(!userUtil.checkUserExsist(userName)){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User not found",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Customer user = userUtil.getUserDetails(userName);
        if(!firmUtil.checkFirmExsist(user.getUserId())){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Dont have any firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Firm firm = firmUtil.getFirmDetails(user.getUserId());
        if(!firm.getFirmName().equals(firmName)){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User are not authorised to add party in this firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if(!partyUtil.checkPartyExsist(partyName, firmName)){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Party Not found",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if(itemUtil.checkItemExsist(requestBody.getItemName(),partyName)){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Item Name already found for party",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if(!itemUtil.checkItemExsist(requestBody.getItemName(),partyName)){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Item Name Not Found",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Item item = itemRepository.findByItemNameAndPartyPartyName(itemName,partyName);
        itemMapper.itemDTOTOItem(requestBody,item);
        Item savedItem = itemRepository.save(item);
        ItemDTO updatedItem = new ItemDTO();
        itemMapper.itemToItemDTO(savedItem,updatedItem);
        ApiResponse<Object> response = new ApiResponse<>(true,"item updated successfully",updatedItem);
        return new ResponseEntity<>(response,HttpStatus.OK);    }
    public ResponseEntity<ApiResponse<Object>> getAllItems(String userName,String firmName) {
        if(!userUtil.checkUserExsist(userName)){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User not found",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Customer user = userUtil.getUserDetails(userName);
        if(!firmUtil.checkFirmExsist(user.getUserId())){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Dont have any firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Firm firm = firmUtil.getFirmDetails(user.getUserId());
        if(!firm.getFirmName().equals(firmName)){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User are not authorised to this firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        List<Party> parties = partyRepository.findByFirmFirmId(firm.getFirmId());
        List<String> allParties = parties.stream().map(Party::getPartyName).toList();
        List<Item> allItems = itemRepository.findByPartyPartyNameIn(allParties);
        List<ItemDTO> allItemsDTO = itemMapper.itemListToDTOList(allItems);
        ApiResponse<Object> response = new ApiResponse<>(true,"all items are fetched successfully",allItemsDTO);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }
    public ResponseEntity<ApiResponse<Object>> getAllPartyItems(String userName, String firmName, String partyName){
        if(!userUtil.checkUserExsist(userName)){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User not found",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Customer user = userUtil.getUserDetails(userName);
        if(!firmUtil.checkFirmExsist(user.getUserId())){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Dont have any firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Firm firm = firmUtil.getFirmDetails(user.getUserId());
        if(!firm.getFirmName().equals(firmName)){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User are not authorised to this firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if(!partyUtil.checkPartyExsist(partyName, firmName)){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Party Not found",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        List<Item> allItems = itemRepository.findByPartyPartyName(partyName);
        List<ItemDTO> allItemsDTO = itemMapper.itemListToDTOList(allItems);
        ApiResponse<Object> response = new ApiResponse<>(true,"All party items fetched successfully",allItemsDTO);
        return new ResponseEntity<>(response,HttpStatus.OK);

    }
}
