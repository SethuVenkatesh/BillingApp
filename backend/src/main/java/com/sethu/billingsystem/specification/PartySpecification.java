package com.sethu.billingsystem.specification;

import com.sethu.billingsystem.model.Firm;
import com.sethu.billingsystem.model.Party;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class PartySpecification {
    public Specification<Party> getAllParties(String partyName,Long firmId) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (!partyName.isEmpty()) {
                Join<Party, Firm> partyFirmJoin = root.join("firm", JoinType.INNER);
                predicates.add(criteriaBuilder.equal(partyFirmJoin.get("firmId"), firmId));
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("partyName")), "%" + partyName.toLowerCase() + "%"));
            } else {
                Join<Party, Firm> partyFirmJoin = root.join("firm", JoinType.INNER);
                predicates.add(criteriaBuilder.equal(partyFirmJoin.get("firmId"), firmId));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
