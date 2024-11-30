package com.sethu.billingsystem.service;

import com.sethu.billingsystem.dto.FirmDTO;
import com.sethu.billingsystem.mapper.FirmMapper;
import com.sethu.billingsystem.model.*;
import com.sethu.billingsystem.repository.FirmRepository;
import com.sethu.billingsystem.repository.UserRepository;
import com.sethu.billingsystem.utils.CommonUtil;
import com.sethu.billingsystem.utils.FirmUtil;
import com.sethu.billingsystem.utils.UserUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FirmService {
    Logger logger = LoggerFactory.getLogger(FirmService.class);
    @Autowired
    UserRepository userRepository;
    @Autowired
    FirmRepository firmRepository;

    @Autowired
    ImageUpload imageService;
    @Autowired
    FirmMapper firmMapper;
    @Autowired
    CommonUtil util;
    @Autowired
    UserUtil userUtil;
    @Autowired
    FirmUtil firmUtil;
    public ResponseEntity<ApiResponse<Object>> createFirm(FirmDTO firmDTO, MultipartFile firmImage) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        boolean isAllNull = util.isNullAllFields(firmDTO);
        if(isAllNull){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Empty Values are passed for firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Customer user = userUtil.getUserDetails(userName);
        Firm firmCheck = firmUtil.getFirmDetails(user.getUserId());
        if(firmCheck!=null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Already Have one firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if(firmUtil.checkUniqueFirm(firmDTO.getFirmName())){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Firm Name Already exist",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        try{
            Firm firm = new Firm();
            firmMapper.firmDTOTOFirm(firmDTO,firm);
            firm.setUser(user);
            if(firmImage != null){
                String logoUrl = imageService.uploadImage(firmImage, user.getCloudinaryFolder()+"/firm");
                firm.setLogoUrl(logoUrl);
            }
            Firm savedFirm = firmRepository.save(firm);
            FirmDTO firmDetails = new FirmDTO();
            firmMapper.firmToFirmDTO(savedFirm,firmDetails);
            ApiResponse<Object> response =new  ApiResponse<>(true,"Firm is Created",firmDetails);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }catch (Exception e){
            logger.info("Exception :{}",e);
            ApiResponse<Object> response =new  ApiResponse<>(false,"error in uploading image",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }


    }

    public ResponseEntity<ApiResponse<Object>> getFirmDetails() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        Customer user = userUtil.getUserDetails(userName);
        Firm firmDetails = firmUtil.getFirmDetails(user.getUserId());
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

    public ResponseEntity<ApiResponse<Object>> updateFirm(FirmDTO firmDTO, MultipartFile firmImage) {
        boolean isAllNull = util.isNullAllFields(firmDTO);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        logger.info("updateFirm : userName : {} ; firm : {}",userName,firmDTO);
        if(isAllNull && firmImage == null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"No Values to update",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Customer user = userUtil.getUserDetails(userName);
        Firm firm = firmUtil.getFirmDetails(user.getUserId());
        if(firm==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Dont have Firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if(firmUtil.checkUniqueFirm(firmDTO.getFirmName())){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Firm Name Already exist",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        try{
            firmMapper.firmDTOTOFirm(firmDTO,firm);
            if(firmImage != null){
                String logoUrl = imageService.uploadImage(firmImage,user.getCloudinaryFolder()+"/firm");
                firm.setLogoUrl(logoUrl);
            }
            Firm savedFirm = firmRepository.save(firm);
            FirmDTO firmDetails = new FirmDTO();
            firmMapper.firmToFirmDTO(savedFirm,firmDetails);
            ApiResponse<Object> response =new  ApiResponse<>(true,"Firm Details updated",firmDetails);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }catch (Exception e){
            logger.info("Exception :{}",e);
            ApiResponse<Object> response =new  ApiResponse<>(false,"error in uploading image",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
