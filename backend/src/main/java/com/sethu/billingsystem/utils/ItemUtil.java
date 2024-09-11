package com.sethu.billingsystem.utils;

import com.sethu.billingsystem.model.Item;
import com.sethu.billingsystem.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ItemUtil {
    @Autowired
    ItemRepository itemRepository;
    public boolean checkItemExsist(String itemName,String partyName){
        Item item = itemRepository.findByItemNameAndPartyPartyName(itemName,partyName);
        return item!=null;
    }

}
