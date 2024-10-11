package com.sethu.billingsystem.utils;

import com.sethu.billingsystem.model.Customer;
import com.sethu.billingsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserUtil {
    @Autowired
    UserRepository userRepository;

    public boolean checkUserExsist(String userName){
        Customer user = userRepository.findOneByUserName(userName);
        return user != null;
    }
    public boolean checkEmailExsist(String email){
        Customer user = userRepository.findOneByEmail(email);
        return user != null;
    }
    public Customer getUserDetails(String userName){
        return userRepository.findOneByUserName(userName);
    }

}
