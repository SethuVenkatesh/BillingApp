package com.sethu.billingsystem.service;

import com.sethu.billingsystem.config.BillingAuthenticationProvider;
import com.sethu.billingsystem.constants.ApplicationConstants;
import com.sethu.billingsystem.dto.AuthRequest;
import com.sethu.billingsystem.dto.UserDTO;
import com.sethu.billingsystem.mapper.UserMapper;
import com.sethu.billingsystem.model.ApiResponse;
import com.sethu.billingsystem.model.Customer;
import com.sethu.billingsystem.repository.UserRepository;
import com.sethu.billingsystem.utils.CommonUtil;
import com.sethu.billingsystem.utils.UserUtil;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class UserService {

    private final AuthenticationManager authenticationManager;
    private final Environment env;


    Logger logger = LoggerFactory.getLogger(UserService.class);
    @Autowired
    UserRepository userRepository;
    @Autowired
    BillingAuthenticationProvider authProvider;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    ImageUpload imageService;
    @Autowired
    UserMapper userMapper;
    @Autowired
    UserUtil userUtil;
    @Autowired
    CommonUtil util;
    public ResponseEntity<ApiResponse<Object>> getUserDetails() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();

        Customer user = userRepository.findOneByUserName(userName);
        UserDTO userDetails = new UserDTO();
        userMapper.userToUserDTO(user,userDetails);
        ApiResponse<Object> response =new  ApiResponse<>(true,"User details is found",userDetails);
        return new ResponseEntity<>(response, HttpStatus.OK);

    }
    public ResponseEntity<ApiResponse<Object>> createUser(UserDTO requestBody, MultipartFile userImage) {
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
        if(userUtil.checkEmailExsist(requestBody.getEmail())){
            ApiResponse<Object> response =new ApiResponse<>(false,"Email Already found",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        try{
            Customer user = new Customer();
            userMapper.userDTOTOUser(requestBody,user);
            String hashPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(hashPassword);
            String cloudinaryFolder = util.generateCloudinaryFolder();
            user.setCloudinaryFolder(cloudinaryFolder);
            String imageUrl = imageService.uploadImage(userImage,cloudinaryFolder);
            user.setProfileUrl(imageUrl);
            Customer savedUser = userRepository.save(user);
            UserDTO userDTO = new UserDTO();
            userMapper.userToUserDTO(savedUser,userDTO);
            ApiResponse<Object> response =new  ApiResponse<>(true,"User is created successfully",userDTO);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }
        catch (Exception ex) {
            ApiResponse<Object> response =new ApiResponse<>(true,"User Creation Failed due to "+ex.getMessage(),null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).
                    body(response);
        }
    }

    public ResponseEntity<ApiResponse<Object>> loginUser(AuthRequest auth) {
        String jwt = "";
        Authentication authentication = UsernamePasswordAuthenticationToken.unauthenticated(auth.getUserName(),
                auth.getPassword());
        Authentication authenticationResponse = authenticationManager.authenticate(authentication);
        if(null != authenticationResponse && authenticationResponse.isAuthenticated()) {
            if (null != env) {
                String secret = env.getProperty(ApplicationConstants.JWT_SECRET,
                        ApplicationConstants.JWT_DEFAULT_SECRET);
                SecretKey secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
                Object GrantedAuthority;
                jwt = Jwts.builder().issuer("Billing System").subject("JWT Token")
                        .claim("username",authenticationResponse.getPrincipal())
                        .claim("authorities",authenticationResponse.getAuthorities().stream().map(org.springframework.security.core.GrantedAuthority::getAuthority).collect(Collectors.joining(",")))
                        .issuedAt(new Date(System.currentTimeMillis()))
                        .expiration(new Date(System.currentTimeMillis() + ApplicationConstants.JWT_TOKEN_EXPIRATION))
                        .signWith(secretKey).compact();
            }
        }

        Customer user=userUtil.getUserDetails(auth.getUserName());
        UserDTO userDTO = new UserDTO();
        userMapper.userToUserDTO(user,userDTO);
        ApiResponse<Object> response = new ApiResponse<>(true,"User Logged In Successfully",userDTO);
        return ResponseEntity.status(HttpStatus.OK).header(ApplicationConstants.JWT_HEADER,jwt).body(response);
    }


    public ResponseEntity<ApiResponse<Object>> updateUserDetails(UserDTO requestBody) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userName = auth.getName();
        logger.info("user {} ",requestBody);
        boolean isAllNull = util.isNullAllFields(requestBody);
        if(isAllNull){
            ApiResponse<Object> response =new ApiResponse<>(false,"Empty Values are passed for user",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if(requestBody.getEmail()!=null && userUtil.checkEmailExsist(requestBody.getEmail())){
            ApiResponse<Object> response =new ApiResponse<>(false,"Email Already found",null);
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        try {
            Customer user = userUtil.getUserDetails(userName);
            userMapper.userDTOTOUser(requestBody,user);
            Customer savedUser = userRepository.save(user);
            UserDTO userDTO = new UserDTO();
            userMapper.userToUserDTO(savedUser,userDTO);
            ApiResponse<Object> response =new  ApiResponse<>(true,"User Updated Successfully",userDTO);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception ex){
            ApiResponse<Object> response =new  ApiResponse<>(true,ex.getMessage(),null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

    }
}
