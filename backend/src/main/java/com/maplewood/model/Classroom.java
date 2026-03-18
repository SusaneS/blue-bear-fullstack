package com.maplewood.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "classrooms")
public class Classroom {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 50, nullable = false, unique = true)
    private String name;
    
    @Column(name = "room_type_id", nullable = false)
    private Long roomTypeId;
    
    @Column(nullable = false)
    private Integer capacity = 10;
    
    @Column(length = 500)
    private String equipment;
    
    @Column(nullable = false)
    private Integer floor = 1;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Constructors
    public Classroom() {}
    
    public Classroom(String name, Long roomTypeId, Integer capacity, 
                    String equipment, Integer floor) {
        this.name = name;
        this.roomTypeId = roomTypeId;
        this.capacity = capacity;
        this.equipment = equipment;
        this.floor = floor;
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
    
    public Long getRoomTypeId() {
        return roomTypeId;
    }
    
    public void setRoomTypeId(Long roomTypeId) {
        this.roomTypeId = roomTypeId;
    }
    
    public Integer getCapacity() {
        return capacity;
    }
    
    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }
    
    public String getEquipment() {
        return equipment;
    }
    
    public void setEquipment(String equipment) {
        this.equipment = equipment;
    }
    
    public Integer getFloor() {
        return floor;
    }
    
    public void setFloor(Integer floor) {
        this.floor = floor;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    // ToString for debugging
    @Override
    public String toString() {
        return "Classroom{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", roomTypeId=" + roomTypeId +
                ", capacity=" + capacity +
                ", floor=" + floor +
                '}';
    }
}