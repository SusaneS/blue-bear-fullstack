package com.maplewood.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "teachers")
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(name = "specialization_id", nullable = false)
    private Integer specializationId;

    @Column(name = "email", unique = true, length = 100)
    private String email;

    @Column(name = "max_daily_hours")
    private Integer maxDailyHours;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Teacher() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public Integer getSpecializationId() { return specializationId; }
    public void setSpecializationId(Integer specializationId) { this.specializationId = specializationId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getMaxDailyHours() { return maxDailyHours; }
    public void setMaxDailyHours(Integer maxDailyHours) { this.maxDailyHours = maxDailyHours; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}