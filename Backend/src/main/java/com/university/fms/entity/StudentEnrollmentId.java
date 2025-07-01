package com.university.fms.entity;

import java.io.Serializable;
import java.util.Objects;

public class StudentEnrollmentId implements Serializable {
    private Long student;
    private Long course;
    private String semester;
    private Integer year;

    // Constructors
    public StudentEnrollmentId() {}

    public StudentEnrollmentId(Long student, Long course, String semester, Integer year) {
        this.student = student;
        this.course = course;
        this.semester = semester;
        this.year = year;
    }

    // Getters and Setters
    public Long getStudent() {
        return student;
    }

    public void setStudent(Long student) {
        this.student = student;
    }

    public Long getCourse() {
        return course;
    }

    public void setCourse(Long course) {
        this.course = course;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StudentEnrollmentId that = (StudentEnrollmentId) o;
        return Objects.equals(student, that.student) &&
                Objects.equals(course, that.course) &&
                Objects.equals(semester, that.semester) &&
                Objects.equals(year, that.year);
    }

    @Override
    public int hashCode() {
        return Objects.hash(student, course, semester, year);
    }
}
