package com.maplewood.dto;

import java.time.LocalDate;

public class SemesterDto {
    private Long id;
    private String name;
    private Integer year;
    private Integer orderInYear;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive;
    private String displayName;
    
    public SemesterDto() {}
    
    public SemesterDto(Long id, String name, Integer year, Integer orderInYear,
                      LocalDate startDate, LocalDate endDate, Boolean isActive) {
        this.id = id;
        this.name = name;
        this.year = year;
        this.orderInYear = orderInYear;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isActive = isActive;
        this.displayName = name + " " + year;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
        this.displayName = name + " " + year;
    }
    
    public Integer getYear() {
        return year;
    }
    
    public void setYear(Integer year) {
        this.year = year;
        this.displayName = name + " " + year;
    }
    
    public Integer getOrderInYear() {
        return orderInYear;
    }
    
    public void setOrderInYear(Integer orderInYear) {
        this.orderInYear = orderInYear;
    }
    
    public LocalDate getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    public LocalDate getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}