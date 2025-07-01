export interface User {
  id: number;
  username: string;
  email: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FacultyProfile {
  id: number;
  user: User;
  firstName: string;
  lastName: string;
  bio?: string;
  profilePictureUrl?: string;
  department?: Department;
  phone?: string;
  officeLocation?: string;
  hireDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  description?: string;
  credits: number;
  department?: Department;
  createdAt: string;
  updatedAt: string;
}

export interface Publication {
  id: number;
  faculty: FacultyProfile;
  title: string;
  publicationDate: string;
  journalName?: string;
  url?: string;
  abstractText?: string;
  doi?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UserCreateRequest {
  username: string;
  password: string;
  email: string;
  roles?: string[];
}

export interface FacultyProfileRequest {
  userId?: number;
  firstName: string;
  lastName: string;
  bio?: string;
  profilePictureUrl?: string;
  departmentId?: number;
  phone?: string;
  officeLocation?: string;
  hireDate?: string;
}

export interface DepartmentRequest {
  name: string;
  description?: string;
}

export interface CourseRequest {
  name: string;
  code: string;
  description?: string;
  credits: number;
  departmentId?: number;
}

export interface PublicationRequest {
  facultyId?: number;
  title: string;
  publicationDate: string;
  journalName?: string;
  url?: string;
  abstractText?: string;
  doi?: string;
}
