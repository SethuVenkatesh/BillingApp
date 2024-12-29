package com.sethu.billingsystem.utils;

import com.sethu.billingsystem.dto.FirmDTO;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
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

    private static final String[] UNITS = {
            "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
            "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
            "Seventeen", "Eighteen", "Nineteen"
    };

    private static final String[] TENS = {
            "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    };

    private static final String[] INDIAN_UNITS = {
            "", "Thousand", "Lakh", "Crore"
    };

    public static String convertToIndianCurrency(BigDecimal amount) {
        // Separate Rupees and Paise
        BigDecimal[] parts = amount.setScale(2, RoundingMode.HALF_UP).divideAndRemainder(BigDecimal.ONE);
        long rupees = parts[0].longValue();
        int paise = parts[1].multiply(BigDecimal.valueOf(100)).intValue();

        String rupeesInWords = convertNumberToWords(rupees);
        String paiseInWords = paise > 0 ?   convertNumberToWords(paise) + " Paise" : "";

        return rupeesInWords + " Rupees" + paiseInWords;
    }

    public static String convertNumberToWords(long number) {
        if (number == 0) {
            return "Zero";
        }

        String words = "";

        // Process the Crore part
        if (number / 10000000 > 0) {
            words += convertLessThanThousand((int) (number / 10000000)) + " Crore ";
            number %= 10000000;
        }

        // Process the Lakh part
        if (number / 100000 > 0) {
            words += convertLessThanThousand((int) (number / 100000)) + " Lakh ";
            number %= 100000;
        }

        // Process the Thousand part
        if (number / 1000 > 0) {
            words += convertLessThanThousand((int) (number / 1000)) + " Thousand ";
            number %= 1000;
        }

        // Process the Hundred part
        if (number / 100 > 0) {
            words += convertLessThanThousand((int) (number / 100)) + " Hundred ";
            number %= 100;
        }

        // Process the remaining part
        if (number > 0) {
            words += "And " + convertLessThanThousand((int) number);
        }

        return words.trim();
    }

    public static String convertLessThanThousand(int number) {
        if (number < 20) {
            return UNITS[number];
        }

        String words = TENS[number / 10];
        if (number % 10 > 0) {
            words += " " + UNITS[number % 10];
        }
        return words;
    }

}
