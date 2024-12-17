package com.sethu.billingsystem.specification;


import com.sethu.billingsystem.constants.PaymentStage;
import com.sethu.billingsystem.model.Firm;
import com.sethu.billingsystem.model.Invoice;
import com.sethu.billingsystem.model.Party;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import jakarta.persistence.criteria.Predicate;

@Component
public class InvoiceSpecification {
    public Specification<Invoice> findAllInvoice(Long invoiceNumber, String partyName, PaymentStage status, Date startDate,Date endDate, Long firmId) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            Join<Party, Firm> invoiceFirmJoin = root.join("firm", JoinType.INNER);
            predicates.add(criteriaBuilder.equal(invoiceFirmJoin.get("firmId"),firmId));
            if(invoiceNumber !=0 ){
                predicates.add(criteriaBuilder.equal(root.get("invoiceNumber"),invoiceNumber));
            }
            if(!partyName.isEmpty()){
                Join<Party, Firm> invoicePartyjoin = root.join("invoiceParty",JoinType.INNER);
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(invoicePartyjoin.get("partyName")),"%"+partyName.toLowerCase()+"%"));
            }
            if(startDate!=null && endDate!=null){
                predicates.add(criteriaBuilder.between(root.get("invoiceDate"),startDate,endDate));
            }
            if(status!=null){
                predicates.add(criteriaBuilder.equal(root.get("paymentStatus"),status));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
