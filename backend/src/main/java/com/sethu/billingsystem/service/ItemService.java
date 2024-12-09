package com.sethu.billingsystem.service;

import com.sethu.billingsystem.dto.ItemDTO;
import com.sethu.billingsystem.mapper.ItemMapper;
import com.sethu.billingsystem.model.*;
import com.sethu.billingsystem.repository.FirmRepository;
import com.sethu.billingsystem.repository.ItemRepository;
import com.sethu.billingsystem.repository.PartyRepository;
import com.sethu.billingsystem.repository.UserRepository;
import com.sethu.billingsystem.specification.ItemSpecification;
import com.sethu.billingsystem.utils.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
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
    ItemSpecification itemSpecification;
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
    public ResponseEntity<ApiResponse<Object>> createNewItem(String partyName, ItemDTO requestBody) {
        boolean isAllNull = util.isNullAllFields(requestBody);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        if(isAllNull){
            ApiResponse<Object> response =new  ApiResponse<>(false,"No Values to update",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Customer user = userUtil.getUserDetails(userName);
        Firm firm = firmUtil.getFirmDetails(user.getUserId());
        if(firm==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Dont have any firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Party party = partyUtil.getPartyDetails(partyName,firm.getFirmName());
        if(party==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Party Not found",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
    public ResponseEntity<ApiResponse<Object>> updateItem(String partyName,String itemName, ItemDTO requestBody) {
        boolean isAllNull = util.isNullAllFields(requestBody);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        if(isAllNull){
            ApiResponse<Object> response =new  ApiResponse<>(false,"No Values to update",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Customer user = userUtil.getUserDetails(userName);
        Firm firm = firmUtil.getFirmDetails(user.getUserId());
        if(firm==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Don't have any firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Party party = partyUtil.getPartyDetails(partyName,firm.getFirmName());
        if(party==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Party Not found",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if(itemUtil.checkItemExsist(requestBody.getItemName(),partyName)){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Item Name already found for party",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Item item = itemRepository.findByItemNameAndPartyPartyName(itemName,partyName);
        if(item==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Item Name Not Found",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        itemMapper.itemDTOTOItem(requestBody,item);
        Item savedItem = itemRepository.save(item);
        ItemDTO updatedItem = new ItemDTO();
        itemMapper.itemToItemDTO(savedItem,updatedItem);
        ApiResponse<Object> response = new ApiResponse<>(true,"item updated successfully",updatedItem);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    public ResponseEntity<ApiResponse<Object>> getAllItems(Integer pageNum, Integer pageSize, String sortType, String sortKey, BigDecimal minPrice, BigDecimal maxPrice, String itemName, String partyName) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();

        Customer user = userUtil.getUserDetails(userName);
        Firm firm = firmUtil.getFirmDetails(user.getUserId());
        if(firm==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User dont have any firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Sort sort = sortType.equals("desc")? Sort.by(sortKey).descending() : Sort.by(sortKey).ascending();
        Pageable itemPageable = PageRequest.of(pageNum-1,pageSize,sort);
        Page<Item> allItems = itemRepository.findAll(itemSpecification.getAllItems(itemName,partyName,minPrice,maxPrice),itemPageable);
        List<ItemDTO> allItemsDTO = itemMapper.itemListToDTOList(allItems.getContent());
        ApiResponse<Object> response = new ApiResponse<>(true,"all items are fetched successfully",allItemsDTO,allItems.getPageable().getPageNumber()+1,allItems.getPageable().getPageSize(),allItems.getTotalElements(),allItems.getTotalPages());
        return new ResponseEntity<>(response,HttpStatus.OK);
    }
    public ResponseEntity<ApiResponse<Object>> getAllPartyItems(String partyName){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();

        Customer user = userUtil.getUserDetails(userName);
        Firm firm = firmUtil.getFirmDetails(user.getUserId());
        if(firm==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Dont have any firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Party party = partyUtil.getPartyDetails(partyName,firm.getFirmName());

        if(party==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Party Not found",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        List<Item> allItems = itemRepository.findByPartyPartyName(partyName);
        List<ItemDTO> allItemsDTO = itemMapper.itemListToDTOList(allItems);
        ApiResponse<Object> response = new ApiResponse<>(true,"All party items fetched successfully",allItemsDTO);
        return new ResponseEntity<>(response,HttpStatus.OK);

    }

    public ResponseEntity<ApiResponse<Object>> deleteItem(String itemName,String partyName) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();

        Customer user = userUtil.getUserDetails(userName);
        Firm firm = firmUtil.getFirmDetails(user.getUserId());
        if(firm==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Dont have any firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Party party = partyUtil.getPartyDetails(partyName,firm.getFirmName());
        if(party==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Party Not found",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Item item = itemUtil.getItemByItemName(itemName,partyName);
        if(item==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Item Name Not Found",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        itemRepository.deleteById(item.getItemId());
        ApiResponse<Object> response = new ApiResponse<>(true,"Item Deleted Successfully",null);
        return new ResponseEntity<>(response,HttpStatus.OK);

    }
}
