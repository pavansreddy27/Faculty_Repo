package com.university.fms.service;

import com.university.fms.dto.request.FacultyProfileRequest;
import com.university.fms.entity.Department;
import com.university.fms.entity.FacultyProfile;
import com.university.fms.entity.User;
import com.university.fms.repository.DepartmentRepository;
import com.university.fms.repository.FacultyProfileRepository;
import com.university.fms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FacultyProfileService {

    @Autowired
    private FacultyProfileRepository facultyProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<FacultyProfile> getAllFacultyProfiles() {
        return facultyProfileRepository.findAll();
    }

    public Optional<FacultyProfile> getFacultyProfileById(Long id) {
        return facultyProfileRepository.findById(id);
    }

    public Optional<FacultyProfile> getFacultyProfileByUserId(Long userId) {
        return facultyProfileRepository.findByUserId(userId);
    }

    public List<FacultyProfile> getFacultyProfilesByDepartment(Long departmentId) {
        return facultyProfileRepository.findByDepartmentId(departmentId);
    }

    public List<FacultyProfile> searchFacultyProfiles(String keyword) {
        return facultyProfileRepository.searchByKeyword(keyword);
    }

    public FacultyProfile createFacultyProfile(FacultyProfileRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found with id: " + request.getDepartmentId()));
        }

        FacultyProfile facultyProfile = new FacultyProfile();
        facultyProfile.setUser(user);
        facultyProfile.setFirstName(request.getFirstName());
        facultyProfile.setLastName(request.getLastName());
        facultyProfile.setBio(request.getBio());
        facultyProfile.setProfilePictureUrl(request.getProfilePictureUrl());
        facultyProfile.setDepartment(department);
        facultyProfile.setPhone(request.getPhone());
        facultyProfile.setOfficeLocation(request.getOfficeLocation());
        facultyProfile.setHireDate(request.getHireDate());

        return facultyProfileRepository.save(facultyProfile);
    }

    public FacultyProfile updateFacultyProfile(Long id, FacultyProfileRequest request) {
        FacultyProfile facultyProfile = facultyProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty profile not found with id: " + id));

        facultyProfile.setFirstName(request.getFirstName());
        facultyProfile.setLastName(request.getLastName());
        facultyProfile.setBio(request.getBio());
        facultyProfile.setProfilePictureUrl(request.getProfilePictureUrl());
        facultyProfile.setPhone(request.getPhone());
        facultyProfile.setOfficeLocation(request.getOfficeLocation());
        facultyProfile.setHireDate(request.getHireDate());

        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found with id: " + request.getDepartmentId()));
            facultyProfile.setDepartment(department);
        }

        return facultyProfileRepository.save(facultyProfile);
    }

    public void deleteFacultyProfile(Long id) {
        FacultyProfile facultyProfile = facultyProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Faculty profile not found with id: " + id));
        facultyProfileRepository.delete(facultyProfile);
    }
}
