package com.sethu.billingsystem.utils;

import com.sethu.billingsystem.dto.FirmDTO;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.stream.Stream;
import java.security.SecureRandom;

@Component
public class CommonUtil {
    private static final SecureRandom random = new SecureRandom();
    private static final int CODE_LENGTH = 12;

    public  String generateCloudinaryFolder() {
        StringBuilder code = new StringBuilder(CODE_LENGTH);
        code.append("CF");
        for (int i = 0; i < CODE_LENGTH; i++) {
            int digit = random.nextInt(10); // generates a random digit from 0-9
            code.append(digit);
        }
        return code.toString();
    }

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
