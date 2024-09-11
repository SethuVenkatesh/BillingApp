package com.sethu.billingsystem.mapper;

import com.sethu.billingsystem.dto.FirmDTO;
import com.sethu.billingsystem.dto.ItemDTO;
import com.sethu.billingsystem.dto.PartyDTO;
import com.sethu.billingsystem.model.Firm;
import com.sethu.billingsystem.model.Item;
import com.sethu.billingsystem.model.Party;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ItemMapper {
    void itemToItemDTO(Item item,@MappingTarget ItemDTO itemDTO);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void itemDTOTOItem(ItemDTO itemDTO,@MappingTarget Item item);
    List<ItemDTO> itemListToDTOList(List<Item> items);

}
