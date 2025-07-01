package com.university.fms.repository;

import com.university.fms.entity.FacultyProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyProfileRepository extends JpaRepository<FacultyProfile, Long> {
    Optional<FacultyProfile> findByUserId(Long userId);
    List<FacultyProfile> findByDepartmentId(Long departmentId);
    
    @Query("SELECT f FROM FacultyProfile f WHERE " +
           "LOWER(f.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(f.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(f.bio) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<FacultyProfile> searchByKeyword(@Param("keyword") String keyword);
}
