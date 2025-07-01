import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Search, Plus, Mail, Phone, MapPin, Calendar, Trash2, Edit, User } from 'lucide-react';
import { facultyService } from '../api/services';
import { FacultyProfile } from '../types';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const FacultyPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [faculty, setFaculty] = useState<FacultyProfile[]>([]);
  const [filteredFaculty, setFilteredFaculty] = useState<FacultyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFaculty();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFaculty(faculty);
    } else {
      const filtered = faculty.filter(
        (f) =>
          f.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.department?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFaculty(filtered);
    }
  }, [searchTerm, faculty]);

  const fetchFaculty = async () => {
    try {
      const response = await facultyService.getAll();
      if (response.data.success) {
        setFaculty(response.data.data);
        setFilteredFaculty(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load faculty data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this faculty profile?')) {
      return;
    }

    try {
      await facultyService.delete(id);
      toast.success('Faculty profile deleted successfully');
      fetchFaculty();
    } catch (error) {
      toast.error('Failed to delete faculty profile');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading faculty data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faculty Profiles</h1>
          <p className="text-gray-600 mt-1">
            Manage and view faculty member information
          </p>
        </div>
        {(hasRole('ADMIN') || hasRole('HR')) && (
          <Link to="/faculty/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Faculty
            </Button>
          </Link>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search faculty by name, department, or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Faculty Grid */}
      {filteredFaculty.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No faculty found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'No faculty match your search criteria.' : 'No faculty profiles have been added yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      {member.profilePictureUrl ? (
                        <img
                          src={member.profilePictureUrl}
                          alt={`${member.firstName} ${member.lastName}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-indigo-600" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {member.firstName} {member.lastName}
                      </CardTitle>
                      {member.department && (
                        <Badge variant="secondary" className="mt-1">
                          {member.department.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {(hasRole('ADMIN') || hasRole('HR')) && (
                    <div className="flex space-x-1">
                      <Link to={`/faculty/${member.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      {hasRole('ADMIN') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(member.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {member.bio && (
                    <CardDescription className="line-clamp-3">
                      {member.bio}
                    </CardDescription>
                  )}
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    {member.user.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>{member.user.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.officeLocation && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{member.officeLocation}</span>
                      </div>
                    )}
                    {member.hireDate && (
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Joined {formatDate(member.hireDate)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link to={`/faculty/${member.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyPage;
