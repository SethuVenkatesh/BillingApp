package com.sethu.billingsystem.repository;

import com.sethu.billingsystem.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item,Long> {
    Item findByItemNameAndPartyPartyName(String itemName,String partyName);
    List<Item> findByPartyPartyName(String partyName);
    List<Item> findByPartyPartyNameIn(List<String> partyName);
}
