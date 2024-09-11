package com.sethu.billingsystem.utils;

import com.sethu.billingsystem.dto.FirmDTO;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.stream.Stream;

@Component
public class CommonUtil {
    public boolean isNullAllFields(Object obj) {
        return Stream.of(obj.getClass().getDeclaredFields())
                .allMatch(field -> {
                    field.setAccessible(true); // Make private fields accessible
                    try {
                        Object value = field.get(obj);
                        return value == null;
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                        return false;
                    }
                });
    }
}
