package com.maplewood.dto;

public class StudentDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private Integer gradeLevel;
    private String email;

    public StudentDTO() {}

    public StudentDTO(Long id, String firstName, String lastName, Integer gradeLevel, String email) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gradeLevel = gradeLevel;
        this.email = email;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public Integer getGradeLevel() { return gradeLevel; }
    public void setGradeLevel(Integer gradeLevel) { this.gradeLevel = gradeLevel; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}