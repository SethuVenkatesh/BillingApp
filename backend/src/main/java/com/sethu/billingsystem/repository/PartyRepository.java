package com.sethu.billingsystem.repository;

import com.sethu.billingsystem.model.Party;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PartyRepository extends JpaRepository<Party,Long> {
    Party findByPartyNameAndFirmFirmName(String partyName,String firmName);


    List<Party> findByPartyNameContainsIgnoreCaseAndFirmFirmId(String partyName,Long firmId);

    Page<Party> findByFirmFirmId(Long firmId, Pageable page);
}
