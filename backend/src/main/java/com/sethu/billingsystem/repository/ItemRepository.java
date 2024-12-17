package com.sethu.billingsystem.repository;

import com.sethu.billingsystem.model.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item,Long>, JpaSpecificationExecutor<Item> {
    Item findByItemNameAndPartyPartyName(String itemName,String partyName);

    List<Item> findByPartyPartyName(String partyName);
    Page<Item> findByPartyPartyNameIn(List<String> partyName, Pageable pageable);
    Page<Item> findAll(Specification<Item> specification,Pageable pageable);
}
