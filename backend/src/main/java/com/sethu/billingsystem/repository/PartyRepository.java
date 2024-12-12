package com.sethu.billingsystem.repository;

import com.sethu.billingsystem.model.Party;
import jakarta.servlet.http.Part;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.nio.file.Path;
import java.util.List;

@Repository
public interface PartyRepository extends JpaRepository<Party,Long>, JpaSpecificationExecutor<Party> {
    Party findByPartyNameAndFirmFirmName(String partyName,String firmName);


    List<Party> findByPartyNameContainsIgnoreCaseAndFirmFirmId(String partyName,Long firmId,Pageable pageable);

    Page<Party> findByFirmFirmId(Long firmId, Pageable page);

    Page<Party> findAll(Specification<Party> specification,Pageable pageable);
}
