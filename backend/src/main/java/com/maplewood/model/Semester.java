package com.maplewood.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.maplewood.converter.LocalDateConverter;

@Entity
@Table(
    name = "semesters",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"name", "year"})
    },
    indexes = {
        @Index(name = "idx_semesters_order_year", columnList = "order_in_year, year")
    }
)
public class Semester {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", length = 20, nullable = false)
    private String name;
    
    @Column(name = "year", nullable = false)
    private Integer year;
    
    @Column(name = "order_in_year", nullable = false)
    private Integer orderInYear;
    
    // ✅ Use LocalDate for DATE columns (not String, not Date)
    @Column(name = "start_date")
    @Convert(converter = LocalDateConverter.class)
    private LocalDate startDate;
    
    // ✅ Use LocalDate for DATE columns
    @Column(name = "end_date")
    @Convert(converter = LocalDateConverter.class)
    private LocalDate endDate;
    
    @Column(name = "is_active")
    private Boolean isActive = false;
    
    // ✅ Use LocalDateTime for DATETIME columns
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
    
    // Constructors
    public Semester() {}
    
    public Semester(String name, Integer year, Integer orderInYear) {
        this.name = name;
        this.year = year;
        this.orderInYear = orderInYear;
    }
    
    public Semester(String name, Integer year, Integer orderInYear, 
                   LocalDate startDate, LocalDate endDate, Boolean isActive) {
        this.name = name;
        this.year = year;
        this.orderInYear = orderInYear;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isActive = isActive;
    }
    
    // Getters and Setters
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
    }
    
    public Integer getYear() {
        return year;
    }
    
    public void setYear(Integer year) {
        this.year = year;
    }
    
    public Integer getOrderInYear() {
        return orderInYear;
    }
    
    public void setOrderInYear(Integer orderInYear) {
        this.orderInYear = orderInYear;
    }
    
    // ✅ Return LocalDate (no parsing needed)
    public LocalDate getStartDate() {
        return startDate;
    }
    
    // ✅ Accept LocalDate (no parsing needed)
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
    
    // ✅ Return LocalDate (no parsing needed)
    public LocalDate getEndDate() {
        return endDate;
    }
    
    // ✅ Accept LocalDate (no parsing needed)
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    // ✅ Return LocalDateTime (no parsing needed)
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    // Helper methods
    public String getDisplayName() {
        return name + " " + year;
    }
    
    public boolean isFall() {
        return orderInYear != null && orderInYear == 1;
    }
    
    public boolean isSpring() {
        return orderInYear != null && orderInYear == 2;
    }
    
    // ToString for debugging
    @Override
    public String toString() {
        return "Semester{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", year=" + year +
                ", orderInYear=" + orderInYear +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", isActive=" + isActive +
                '}';
    }
}