package com.maplewood.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "teachers")
public class Teacher {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "first_name", length = 100, nullable = false)
    private String firstName;
    
    @Column(name = "last_name", length = 100, nullable = false)
    private String lastName;
    
    @Column(name = "specialization_id", nullable = false)
    private Long specializationId;
    
    @Column(length = 255, unique = true)
    private String email;
    
    @Column(name = "max_daily_hours")
    private Integer maxDailyHours = 4;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors
    public Teacher() {}
    
    public Teacher(String firstName, String lastName, Long specializationId, 
                  String email, Integer maxDailyHours) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.specializationId = specializationId;
        this.email = email;
        this.maxDailyHours = maxDailyHours;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public Long getSpecializationId() {
        return specializationId;
    }
    
    public void setSpecializationId(Long specializationId) {
        this.specializationId = specializationId;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public Integer getMaxDailyHours() {
        return maxDailyHours;
    }
    
    public void setMaxDailyHours(Integer maxDailyHours) {
        this.maxDailyHours = maxDailyHours;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    // Helper method to get full name
    public String getFullName() {
        return firstName + " " + lastName;
    }
    
    // ToString for debugging
    @Override
    public String toString() {
        return "Teacher{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", specializationId=" + specializationId +
                '}';
    }
}