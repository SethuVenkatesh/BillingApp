package com.sethu.billingsystem.mapper;

import com.sethu.billingsystem.dto.UserDTO;
import com.sethu.billingsystem.model.Customer;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface UserMapper {
    void userToUserDTO(Customer user, @MappingTarget UserDTO userDTO);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void userDTOTOUser(UserDTO userDTO,@MappingTarget Customer user);
}