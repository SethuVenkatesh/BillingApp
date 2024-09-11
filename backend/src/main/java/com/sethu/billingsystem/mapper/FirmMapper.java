package com.sethu.billingsystem.mapper;

import com.sethu.billingsystem.dto.FirmDTO;
import com.sethu.billingsystem.dto.UserDTO;
import com.sethu.billingsystem.model.Firm;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface FirmMapper {
    void firmToFirmDTO(Firm firm, @MappingTarget FirmDTO firmDTO);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void firmDTOTOFirm(FirmDTO firmDTO,@MappingTarget Firm firm);
}
