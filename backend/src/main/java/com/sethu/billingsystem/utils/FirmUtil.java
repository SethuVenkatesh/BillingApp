package com.sethu.billingsystem.utils;

import com.sethu.billingsystem.model.Firm;
import com.sethu.billingsystem.repository.FirmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FirmUtil {
    @Autowired
    FirmRepository firmRepository;
    public boolean checkFirmExsist(Long userId){
        Firm firm = firmRepository.findByUserUserId(userId);
        System.out.println("Firm "+firm);
        return firm!=null;
    }
    public boolean checkUniqueFirm(String firmName){
        Firm exsistingFirm = firmRepository.findByFirmName(firmName);
        return exsistingFirm!=null;
    }
    public Firm getFirmDetails(Long userId){
        return firmRepository.findByUserUserId(userId);
    }
}
