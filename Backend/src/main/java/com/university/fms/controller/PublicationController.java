package com.university.fms.controller;

import com.university.fms.dto.request.PublicationRequest;
import com.university.fms.dto.response.ApiResponse;
import com.university.fms.entity.Publication;
import com.university.fms.service.PublicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/publications")
public class PublicationController {

    @Autowired
    private PublicationService publicationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Publication>>> getAllPublications() {
        try {
            List<Publication> publications = publicationService.getAllPublications();
            return ResponseEntity.ok(ApiResponse.success("Publications retrieved successfully", publications));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve publications: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Publication>> getPublicationById(@PathVariable Long id) {
        try {
            Optional<Publication> publication = publicationService.getPublicationById(id);
            if (publication.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Publication retrieved successfully", publication.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve publication: " + e.getMessage()));
        }
    }

    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<ApiResponse<List<Publication>>> getPublicationsByFaculty(@PathVariable Long facultyId) {
        try {
            List<Publication> publications = publicationService.getPublicationsByFaculty(facultyId);
            return ResponseEntity.ok(ApiResponse.success("Publications retrieved successfully", publications));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve publications: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Publication>>> searchPublications(@RequestParam String keyword) {
        try {
            List<Publication> publications = publicationService.searchPublications(keyword);
            return ResponseEntity.ok(ApiResponse.success("Publications retrieved successfully", publications));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to search publications: " + e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<ApiResponse<Publication>> createPublication(@Valid @RequestBody PublicationRequest request) {
        try {
            Publication publication = publicationService.createPublication(request);
            return ResponseEntity.ok(ApiResponse.success("Publication created successfully", publication));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create publication: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<ApiResponse<Publication>> updatePublication(@PathVariable Long id, 
                                                                     @Valid @RequestBody PublicationRequest request) {
        try {
            Publication publication = publicationService.updatePublication(id, request);
            return ResponseEntity.ok(ApiResponse.success("Publication updated successfully", publication));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update publication: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<ApiResponse<Void>> deletePublication(@PathVariable Long id) {
        try {
            publicationService.deletePublication(id);
            return ResponseEntity.ok(ApiResponse.success("Publication deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete publication: " + e.getMessage()));
        }
    }
}
