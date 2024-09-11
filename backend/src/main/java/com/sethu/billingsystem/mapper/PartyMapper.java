package com.sethu.billingsystem.mapper;

import com.sethu.billingsystem.dto.FirmDTO;
import com.sethu.billingsystem.dto.PartyDTO;
import com.sethu.billingsystem.model.Firm;
import com.sethu.billingsystem.model.Party;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PartyMapper {
    void partyToPartyDTO(Party party, @MappingTarget PartyDTO partyDTO);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partyDTOTOParty(PartyDTO partyDTO,@MappingTarget Party party);

    List<PartyDTO> partyListToDTOList(List<Party> parties);

}
