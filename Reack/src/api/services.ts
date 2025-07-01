import api from './axios';
import {
  User,
  FacultyProfile,
  Department,
  Course,
  Publication,
  Role,
  UserCreateRequest,
  FacultyProfileRequest,
  DepartmentRequest,
  CourseRequest,
  PublicationRequest,
  ApiResponse
} from '../types';

// Auth Services
export const authService = {
  logout: () => api.post('/auth/logout'),
};

// User Services
export const userService = {
  getAll: () => api.get<ApiResponse<User[]>>('/users'),
  getById: (id: number) => api.get<ApiResponse<User>>(`/users/${id}`),
  create: (data: UserCreateRequest) => api.post<ApiResponse<User>>('/users', data),
  update: (id: number, data: UserCreateRequest) => api.put<ApiResponse<User>>(`/users/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/users/${id}`),
  getByRole: (roleName: string) => api.get<ApiResponse<User[]>>(`/users/role/${roleName}`),
};

// Faculty Services
export const facultyService = {
  getAll: () => api.get<ApiResponse<FacultyProfile[]>>('/faculty'),
  getById: (id: number) => api.get<ApiResponse<FacultyProfile>>(`/faculty/${id}`),
  getByUserId: (userId: number) => api.get<ApiResponse<FacultyProfile>>(`/faculty/user/${userId}`),
  getByDepartment: (departmentId: number) => api.get<ApiResponse<FacultyProfile[]>>(`/faculty/department/${departmentId}`),
  search: (keyword: string) => api.get<ApiResponse<FacultyProfile[]>>(`/faculty/search?keyword=${keyword}`),
  create: (data: FacultyProfileRequest) => api.post<ApiResponse<FacultyProfile>>('/faculty', data),
  update: (id: number, data: FacultyProfileRequest) => api.put<ApiResponse<FacultyProfile>>(`/faculty/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/faculty/${id}`),
};

// Department Services
export const departmentService = {
  getAll: () => api.get<ApiResponse<Department[]>>('/departments'),
  getById: (id: number) => api.get<ApiResponse<Department>>(`/departments/${id}`),
  create: (data: DepartmentRequest) => api.post<ApiResponse<Department>>('/departments', data),
  update: (id: number, data: DepartmentRequest) => api.put<ApiResponse<Department>>(`/departments/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/departments/${id}`),
};

// Course Services
export const courseService = {
  getAll: () => api.get<ApiResponse<Course[]>>('/courses'),
  getById: (id: number) => api.get<ApiResponse<Course>>(`/courses/${id}`),
  getByDepartment: (departmentId: number) => api.get<ApiResponse<Course[]>>(`/courses/department/${departmentId}`),
  getByFaculty: (facultyId: number) => api.get<ApiResponse<Course[]>>(`/courses/faculty/${facultyId}`),
  search: (keyword: string) => api.get<ApiResponse<Course[]>>(`/courses/search?keyword=${keyword}`),
  create: (data: CourseRequest) => api.post<ApiResponse<Course>>('/courses', data),
  update: (id: number, data: CourseRequest) => api.put<ApiResponse<Course>>(`/courses/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/courses/${id}`),
};

// Publication Services
export const publicationService = {
  getAll: () => api.get<ApiResponse<Publication[]>>('/publications'),
  getById: (id: number) => api.get<ApiResponse<Publication>>(`/publications/${id}`),
  getByFaculty: (facultyId: number) => api.get<ApiResponse<Publication[]>>(`/publications/faculty/${facultyId}`),
  search: (keyword: string) => api.get<ApiResponse<Publication[]>>(`/publications/search?keyword=${keyword}`),
  create: (data: PublicationRequest) => api.post<ApiResponse<Publication>>('/publications', data),
  update: (id: number, data: PublicationRequest) => api.put<ApiResponse<Publication>>(`/publications/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/publications/${id}`),
};

// Role Services
export const roleService = {
  getAll: () => api.get<ApiResponse<Role[]>>('/roles'),
};
