package com.maplewood.converter;

import jakarta.persistence.AttributeConverter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class LocalDateConverter implements AttributeConverter<LocalDate, String> {
    
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    
    @Override
    public String convertToDatabaseColumn(LocalDate attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.format(FORMATTER);
    }
    
    @Override
    public LocalDate convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        return LocalDate.parse(dbData, FORMATTER);
    }
}