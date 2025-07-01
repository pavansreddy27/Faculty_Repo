package com.university.fms.repository;

import com.university.fms.entity.StudentEnrollment;
import com.university.fms.entity.StudentEnrollmentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentEnrollmentRepository extends JpaRepository<StudentEnrollment, StudentEnrollmentId> {
    List<StudentEnrollment> findByStudentId(Long studentId);
    List<StudentEnrollment> findByCourseId(Long courseId);
    List<StudentEnrollment> findByStudentIdAndSemesterAndYear(Long studentId, String semester, Integer year);
    List<StudentEnrollment> findByCourseIdAndSemesterAndYear(Long courseId, String semester, Integer year);
    
    @Query("SELECT COUNT(se) FROM StudentEnrollment se WHERE se.course.id = :courseId")
    Long countByCourseId(@Param("courseId") Long courseId);
    
    @Query("SELECT COUNT(se) FROM StudentEnrollment se WHERE se.student.id = :studentId")
    Long countByStudentId(@Param("studentId") Long studentId);
}
