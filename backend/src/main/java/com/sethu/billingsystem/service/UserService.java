package com.sethu.billingsystem.service;

import com.sethu.billingsystem.dto.UserDTO;
import com.sethu.billingsystem.mapper.UserMapper;
import com.sethu.billingsystem.model.ApiResponse;
import com.sethu.billingsystem.model.Customer;
import com.sethu.billingsystem.repository.UserRepository;
import com.sethu.billingsystem.utils.CommonUtil;
import com.sethu.billingsystem.utils.UserUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    Logger logger = LoggerFactory.getLogger(UserService.class);
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    UserMapper userMapper;
    @Autowired
    UserUtil userUtil;
    @Autowired
    CommonUtil util;
    public ResponseEntity<ApiResponse<Object>> getUserDetails(String userName) {
        if(!userUtil.checkUserExsist(userName)){
            ApiResponse<Object> response =new  ApiResponse<>(false,"User Name not found",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Customer user = userRepository.findOneByUserName(userName);
        UserDTO userDetails = new UserDTO();
        userMapper.userToUserDTO(user,userDetails);
        ApiResponse<Object> response =new  ApiResponse<>(true,"User details is found",userDetails);
        return new ResponseEntity<>(response, HttpStatus.OK);

    }
    public ResponseEntity<ApiResponse<Object>> createUser(UserDTO requestBody) {
        logger.info("user {} ",requestBody);
        boolean isAllNull = util.isNullAllFields(requestBody);
        if(isAllNull){
            ApiResponse<Object> response =new ApiResponse<>(false,"Empty Values are passed for user",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if(userUtil.checkUserExsist(requestBody.getUserName())){
            ApiResponse<Object> response =new ApiResponse<>(false,"User Name Already found",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Customer user = new Customer();
        userMapper.userDTOTOUser(requestBody,user);
        String hashPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashPassword);
        Customer savedUser = userRepository.save(user);
        UserDTO userDTO = new UserDTO();
        userMapper.userToUserDTO(savedUser,userDTO);
        ApiResponse<Object> response =new  ApiResponse<>(true,"User is created",userDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);

    }
}
