package com.university.fms.controller;

import com.university.fms.dto.request.FacultyProfileRequest;
import com.university.fms.dto.response.ApiResponse;
import com.university.fms.entity.FacultyProfile;
import com.university.fms.service.FacultyProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/faculty")
public class FacultyController {

    @Autowired
    private FacultyProfileService facultyProfileService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FacultyProfile>>> getAllFacultyProfiles() {
        try {
            List<FacultyProfile> profiles = facultyProfileService.getAllFacultyProfiles();
            return ResponseEntity.ok(ApiResponse.success("Faculty profiles retrieved successfully", profiles));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve faculty profiles: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FacultyProfile>> getFacultyProfileById(@PathVariable Long id) {
        try {
            Optional<FacultyProfile> profile = facultyProfileService.getFacultyProfileById(id);
            if (profile.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Faculty profile retrieved successfully", profile.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve faculty profile: " + e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<FacultyProfile>> getFacultyProfileByUserId(@PathVariable Long userId) {
        try {
            Optional<FacultyProfile> profile = facultyProfileService.getFacultyProfileByUserId(userId);
            if (profile.isPresent()) {
                return ResponseEntity.ok(ApiResponse.success("Faculty profile retrieved successfully", profile.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve faculty profile: " + e.getMessage()));
        }
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<ApiResponse<List<FacultyProfile>>> getFacultyProfilesByDepartment(@PathVariable Long departmentId) {
        try {
            List<FacultyProfile> profiles = facultyProfileService.getFacultyProfilesByDepartment(departmentId);
            return ResponseEntity.ok(ApiResponse.success("Faculty profiles retrieved successfully", profiles));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve faculty profiles: " + e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<FacultyProfile>>> searchFacultyProfiles(@RequestParam String keyword) {
        try {
            List<FacultyProfile> profiles = facultyProfileService.searchFacultyProfiles(keyword);
            return ResponseEntity.ok(ApiResponse.success("Faculty profiles retrieved successfully", profiles));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to search faculty profiles: " + e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR')")
    public ResponseEntity<ApiResponse<FacultyProfile>> createFacultyProfile(@Valid @RequestBody FacultyProfileRequest request) {
        try {
            FacultyProfile profile = facultyProfileService.createFacultyProfile(request);
            return ResponseEntity.ok(ApiResponse.success("Faculty profile created successfully", profile));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create faculty profile: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('HR') or hasRole('FACULTY')")
    public ResponseEntity<ApiResponse<FacultyProfile>> updateFacultyProfile(@PathVariable Long id, 
                                                                           @Valid @RequestBody FacultyProfileRequest request) {
        try {
            FacultyProfile profile = facultyProfileService.updateFacultyProfile(id, request);
            return ResponseEntity.ok(ApiResponse.success("Faculty profile updated successfully", profile));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update faculty profile: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFacultyProfile(@PathVariable Long id) {
        try {
            facultyProfileService.deleteFacultyProfile(id);
            return ResponseEntity.ok(ApiResponse.success("Faculty profile deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete faculty profile: " + e.getMessage()));
        }
    }
}
