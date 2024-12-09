package com.sethu.billingsystem.specification;

import com.sethu.billingsystem.model.Item;
import com.sethu.billingsystem.model.Party;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class ItemSpecification {

    public Specification<Item> getAllItems(String itemName,String partyName,BigDecimal minPrice,BigDecimal maxPrice){
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if(!itemName.isEmpty()){
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("itemName")),"%"+itemName.toLowerCase()+"%"));
            }
            if(!partyName.isEmpty()){
                Join<Item, Party> itemPartyJoin = root.join("party", JoinType.INNER);
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(itemPartyJoin.get("partyName")),"%"+partyName.toLowerCase()+"%"));
            }
            predicates.add(criteriaBuilder.between(root.get("price"),minPrice,maxPrice));
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

    }
    public static Specification<Item> hasItemName(String itemName){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("itemName"),"%"+itemName+"%"));
    }

    public static Specification<Item> hasPartyName(String partyName){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.like(root.get("party_partyName"),"%"+partyName+"%"));
    }

    public static Specification<Item> hasPriceBetween(BigDecimal minValue,BigDecimal maxValue){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.between(root.get("price"),minValue,maxValue));
    }

}
