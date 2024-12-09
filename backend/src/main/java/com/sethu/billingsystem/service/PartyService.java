package com.sethu.billingsystem.service;

import com.sethu.billingsystem.dto.PartyDTO;
import com.sethu.billingsystem.mapper.PartyMapper;
import com.sethu.billingsystem.model.ApiResponse;
import com.sethu.billingsystem.model.Customer;
import com.sethu.billingsystem.model.Firm;
import com.sethu.billingsystem.model.Party;
import com.sethu.billingsystem.repository.FirmRepository;
import com.sethu.billingsystem.repository.PartyRepository;
import com.sethu.billingsystem.repository.UserRepository;
import com.sethu.billingsystem.utils.CommonUtil;
import com.sethu.billingsystem.utils.FirmUtil;
import com.sethu.billingsystem.utils.PartyUtil;
import com.sethu.billingsystem.utils.UserUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class PartyService {
    Logger logger = LoggerFactory.getLogger(PartyService.class);

    @Autowired
    FirmRepository firmRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PartyRepository partyRepository;
    @Autowired
    PartyMapper partyMapper;

    @Autowired
    ImageUpload imageService;
    @Autowired
    CommonUtil util;
    @Autowired
    UserUtil userUtil;
    @Autowired
    FirmUtil firmUtil;
    @Autowired
    PartyUtil partyUtil;
    public ResponseEntity<ApiResponse<Object>> createParty(PartyDTO requestBody, MultipartFile partyImage) {
        boolean isAllNull = util.isNullAllFields(requestBody);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        logger.info("create Party : userName : {} ; party : {}",userName,requestBody);
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
        if(partyUtil.checkPartyExsist(requestBody.getPartyName(), firm.getFirmName())){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Party Name already exsist",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        try{
            Party party = new Party();
            partyMapper.partyDTOTOParty(requestBody,party);
            party.setFirm(firm);
            if(partyImage != null){
                String logoUrl = imageService.uploadImage(partyImage, user.getCloudinaryFolder()+"/party");
                party.setLogoUrl(logoUrl);
            }
            Party savedParty = partyRepository.save(party);
            PartyDTO partyDTO = new PartyDTO();
            partyMapper.partyToPartyDTO(savedParty,partyDTO);
            ApiResponse<Object> response =new  ApiResponse<>(true,"Firm is Created",partyDTO);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }catch (Exception e){
            logger.info("Exception : {}",e);
            ApiResponse<Object> response =new  ApiResponse<>(false,"Error in uploading image",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    public ResponseEntity<ApiResponse<Object>> updateParty(String partyName, PartyDTO requestBody, MultipartFile partyImage) {
        boolean isAllNull = util.isNullAllFields(requestBody);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        logger.info("create Party : userName : {} ; party : {}",userName,requestBody);
        if(isAllNull && partyImage == null){
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
        if(partyUtil.checkPartyExsist(requestBody.getPartyName(), firm.getFirmName())){
            ApiResponse<Object> response =new  ApiResponse<>(false,"Party Name already exsist",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        try{
            if(partyImage != null){
                String logoUrl = imageService.uploadImage(partyImage, user.getCloudinaryFolder()+"/party");
                party.setLogoUrl(logoUrl);
            }
            partyMapper.partyDTOTOParty(requestBody,party);
            Party updatedParty = partyRepository.save(party);
            PartyDTO partyDTO = new PartyDTO();
            partyMapper.partyToPartyDTO(updatedParty,partyDTO);
            ApiResponse<Object> response =new  ApiResponse<>(true,"Firm Details updated",partyDTO);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }catch(Exception e){
            logger.info("Exception : {} ", e);
            ApiResponse<Object> response =new  ApiResponse<>(false,"Error in uploading image",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<ApiResponse<Object>> getPartyDetails(String partyName) {
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
        PartyDTO partyDTO= new PartyDTO();
        partyMapper.partyToPartyDTO(party,partyDTO);
        ApiResponse<Object> response =new  ApiResponse<>(true,"Firm Details Fetched",partyDTO);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    public ResponseEntity<ApiResponse<Object>> getAllParties(Integer pageNum,Integer pageSize) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        Customer user = userUtil.getUserDetails(userName);
        Firm firm = firmUtil.getFirmDetails(user.getUserId());
        if(firm==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Dont have any firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Pageable pageable = PageRequest.of(pageNum-1,pageSize, Sort.by("createdAt").descending());
        Page<Party> allParties = partyRepository.findByFirmFirmId(firm.getFirmId(),pageable);
        List<PartyDTO> allPartyDTO = partyMapper.partyListToDTOList(allParties.getContent());
        ApiResponse<Object> response = new ApiResponse<>(true,"List of parties under firm fetched",allPartyDTO,allParties.getPageable().getPageNumber()+1,allParties.getPageable().getPageSize(), allParties.getTotalElements(), allParties.getTotalPages());
        return new ResponseEntity<>(response,HttpStatus.OK);

    }

    public ResponseEntity<ApiResponse<Object>> deleteParty(String partyName) {
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
        partyRepository.deleteById(party.getPartyId());
        ApiResponse<Object> response = new ApiResponse<>(true,"Party Deleted successfully",null);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    public ResponseEntity<ApiResponse<Object>> getPartyLists(String partyName) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        Customer user = userUtil.getUserDetails(userName);
        Firm firm = firmUtil.getFirmDetails(user.getUserId());
        if(firm==null){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Dont have any firm",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        List<Party> allParties = partyRepository.findByPartyNameContainsIgnoreCaseAndFirmFirmId(partyName,firm.getFirmId());
        List<PartyDTO> allPartyDTO = partyMapper.partyListToDTOList(allParties);
        ApiResponse<Object> response = new ApiResponse<>(true,"Parties containing "+ partyName +" text found",allPartyDTO);
        return new ResponseEntity<>(response,HttpStatus.OK);

    }
}
