package com.university.fms.service;

import com.university.fms.dto.request.PublicationRequest;
import com.university.fms.entity.FacultyProfile;
import com.university.fms.entity.Publication;
import com.university.fms.repository.FacultyProfileRepository;
import com.university.fms.repository.PublicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PublicationService {

    @Autowired
    private PublicationRepository publicationRepository;

    @Autowired
    private FacultyProfileRepository facultyProfileRepository;

    public List<Publication> getAllPublications() {
        return publicationRepository.findAll();
    }

    public Optional<Publication> getPublicationById(Long id) {
        return publicationRepository.findById(id);
    }

    public List<Publication> getPublicationsByFaculty(Long facultyId) {
        return publicationRepository.findByFacultyIdOrderByPublicationDateDesc(facultyId);
    }

    public List<Publication> searchPublications(String keyword) {
        return publicationRepository.searchByKeyword(keyword);
    }

    public Long getPublicationCountByFaculty(Long facultyId) {
        return publicationRepository.countByFacultyId(facultyId);
    }

    public Publication createPublication(PublicationRequest request) {
        FacultyProfile faculty = facultyProfileRepository.findById(request.getFacultyId())
                .orElseThrow(() -> new RuntimeException("Faculty not found with id: " + request.getFacultyId()));

        Publication publication = new Publication();
        publication.setFaculty(faculty);
        publication.setTitle(request.getTitle());
        publication.setPublicationDate(request.getPublicationDate());
        publication.setJournalName(request.getJournalName());
        publication.setUrl(request.getUrl());
        publication.setAbstractText(request.getAbstractText());
        publication.setDoi(request.getDoi());

        return publicationRepository.save(publication);
    }

    public Publication updatePublication(Long id, PublicationRequest request) {
        Publication publication = publicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publication not found with id: " + id));

        publication.setTitle(request.getTitle());
        publication.setPublicationDate(request.getPublicationDate());
        publication.setJournalName(request.getJournalName());
        publication.setUrl(request.getUrl());
        publication.setAbstractText(request.getAbstractText());
        publication.setDoi(request.getDoi());

        if (request.getFacultyId() != null) {
            FacultyProfile faculty = facultyProfileRepository.findById(request.getFacultyId())
                    .orElseThrow(() -> new RuntimeException("Faculty not found with id: " + request.getFacultyId()));
            publication.setFaculty(faculty);
        }

        return publicationRepository.save(publication);
    }

    public void deletePublication(Long id) {
        Publication publication = publicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publication not found with id: " + id));
        publicationRepository.delete(publication);
    }
}
