package com.sethu.billingsystem.service;

import com.sethu.billingsystem.controller.FirmController;

import com.sethu.billingsystem.dto.FirmDTO;
import com.sethu.billingsystem.mapper.FirmMapper;
import com.sethu.billingsystem.model.*;
import com.sethu.billingsystem.repository.FirmRepository;
import com.sethu.billingsystem.repository.UserRepository;
import com.sethu.billingsystem.utils.CommonUtil;
import com.sethu.billingsystem.utils.FirmUtil;
import com.sethu.billingsystem.utils.UserUtil;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
@Service
public class FirmService {
    Logger logger = LoggerFactory.getLogger(FirmService.class);
    @Autowired
    UserRepository userRepository;
    @Autowired
    FirmRepository firmRepository;
    @Autowired
    FirmMapper firmMapper;
    @Autowired
    CommonUtil util;
    @Autowired
    UserUtil userUtil;
    @Autowired
    FirmUtil firmUtil;
    public ResponseEntity<ApiResponse<Object>> createFirm(FirmDTO firmDTO, String userName) {
        logger.info("create Firm : userName : {} ; firm : {}",userName,firmDTO);
        boolean isAllNull = util.isNullAllFields(firmDTO);
        if(isAllNull){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Empty Values are passed for firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if(!userUtil.checkUserExsist(userName)){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User not found",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Customer user = userUtil.getUserDetails(userName);
        if(firmUtil.checkFirmExsist(user.getUserId())){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Already Have one firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if(firmUtil.checkUniqueFirm(firmDTO.getFirmName())){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Firm Name Already exist",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        Firm firm = new Firm();
        firmMapper.firmDTOTOFirm(firmDTO,firm);
        firm.setUser(user);
        Firm savedFirm = firmRepository.save(firm);
        FirmDTO firmDetails = new FirmDTO();
        firmMapper.firmToFirmDTO(savedFirm,firmDetails);
        ApiResponse<Object> response =new  ApiResponse<>(true,"Firm is Created",firmDetails);
        return new ResponseEntity<>(response, HttpStatus.CREATED);

    }

    public ResponseEntity<ApiResponse<Object>> getFirmDetails(String userName) {
        if(!userUtil.checkUserExsist(userName)){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User not found",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Customer user = userUtil.getUserDetails(userName);
        Firm firmDetails = firmRepository.findByUserUserId(user.getUserId());
        if(firmDetails == null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"No Firm is found for the user",null);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }else{
            FirmDTO firmDTO = new FirmDTO();
            firmMapper.firmToFirmDTO(firmDetails,firmDTO);
            ApiResponse<Object> response =new  ApiResponse<>(true,"Firm Details found ",firmDTO);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    public ResponseEntity<ApiResponse<Object>> updateFirm(FirmDTO firmDTO, String userName) {
        boolean isAllNull = util.isNullAllFields(firmDTO);
        logger.info("updateFirm : userName : {} ; firm : {}",userName,firmDTO);
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
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Dont have Firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if(firmUtil.checkUniqueFirm(firmDTO.getFirmName())){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Firm Name Already exist",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Firm firm = firmRepository.findByUserUserId(user.getUserId());
        firmMapper.firmDTOTOFirm(firmDTO,firm);
        Firm savedFirm = firmRepository.save(firm);
        FirmDTO firmDetails = new FirmDTO();
        firmMapper.firmToFirmDTO(savedFirm,firmDetails);
        ApiResponse<Object> response =new  ApiResponse<>(true,"Firm Details updated",firmDetails);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
