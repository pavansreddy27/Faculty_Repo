package com.university.fms.repository;

import com.university.fms.entity.Publication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicationRepository extends JpaRepository<Publication, Long> {
    List<Publication> findByFacultyId(Long facultyId);
    List<Publication> findByFacultyIdOrderByPublicationDateDesc(Long facultyId);
    
    @Query("SELECT p FROM Publication p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.journalName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.abstractText) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Publication> searchByKeyword(@Param("keyword") String keyword);
    
    @Query("SELECT COUNT(p) FROM Publication p WHERE p.faculty.id = :facultyId")
    Long countByFacultyId(@Param("facultyId") Long facultyId);
}
