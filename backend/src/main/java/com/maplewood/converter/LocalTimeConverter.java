package com.maplewood.converter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

// @Converter(austoApply = true)
public class LocalTimeConverter implements AttributeConverter<LocalTime, String> {
    
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    
    @Override
    public String convertToDatabaseColumn(LocalTime attribute) {
        return attribute == null ? null : attribute.format(FORMATTER);
    }
    
    @Override
    public LocalTime convertToEntityAttribute(String dbData) {
        // System.out.println(">>> convertToEntityAttribute called with: " + dbData);
        if (dbData == null || dbData.trim().isEmpty()) {
            return null;
        }
        try {
            return LocalTime.parse(dbData, FORMATTER);
        } catch (Exception e) {
            // Handle bad data gracefully
            return null;
        }
    }
}