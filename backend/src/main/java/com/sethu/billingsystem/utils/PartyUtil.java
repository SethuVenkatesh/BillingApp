package com.sethu.billingsystem.utils;

import com.sethu.billingsystem.model.Party;
import com.sethu.billingsystem.repository.PartyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PartyUtil {
    @Autowired
    PartyRepository partyRepository;
    public boolean checkPartyExsist(String partyName,String firmName){
        Party party = partyRepository.findByPartyNameAndFirmFirmName(partyName, firmName);
        return party!=null;
    }
    public Party getPartyDetails(String partyName,String firmName){
        return partyRepository.findByPartyNameAndFirmFirmName(partyName, firmName);
    }
}
