import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, BookOpen, Building2, FileText, TrendingUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { facultyService, departmentService, courseService, publicationService } from '../api/services';
import { toast } from 'react-hot-toast';

interface DashboardStats {
  totalFaculty: number;
  totalDepartments: number;
  totalCourses: number;
  totalPublications: number;
}

const DashboardPage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalFaculty: 0,
    totalDepartments: 0,
    totalCourses: 0,
    totalPublications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [facultyRes, departmentRes, courseRes, publicationRes] = await Promise.all([
          facultyService.getAll(),
          departmentService.getAll(),
          courseService.getAll(),
          publicationService.getAll(),
        ]);

        setStats({
          totalFaculty: facultyRes.data.data.length,
          totalDepartments: departmentRes.data.data.length,
          totalCourses: courseRes.data.data.length,
          totalPublications: publicationRes.data.data.length,
        });
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Total Faculty',
      value: stats.totalFaculty,
      icon: Users,
      color: 'bg-blue-500',
      link: '/faculty',
    },
    {
      title: 'Departments',
      value: stats.totalDepartments,
      icon: Building2,
      color: 'bg-green-500',
      link: '/departments',
    },
    {
      title: 'Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'bg-yellow-500',
      link: '/courses',
    },
    {
      title: 'Publications',
      value: stats.totalPublications,
      icon: FileText,
      color: 'bg-purple-500',
      link: '/publications',
    },
  ];

  const quickActions = [
    {
      title: 'View Faculty Profiles',
      description: 'Browse and manage faculty information',
      icon: Users,
      link: '/faculty',
      roles: ['ADMIN', 'HR', 'FACULTY', 'STUDENT'],
    },
    {
      title: 'Manage Departments',
      description: 'Add and organize academic departments',
      icon: Building2,
      link: '/departments',
      roles: ['ADMIN'],
    },
    {
      title: 'Course Catalog',
      description: 'View and manage course offerings',
      icon: BookOpen,
      link: '/courses',
      roles: ['ADMIN', 'FACULTY', 'STUDENT'],
    },
    {
      title: 'Research Publications',
      description: 'Track faculty research and publications',
      icon: FileText,
      link: '/publications',
      roles: ['ADMIN', 'FACULTY', 'STUDENT'],
    },
  ];

  const filteredQuickActions = quickActions.filter(action =>
    action.roles.some(role => hasRole(role))
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-indigo-100 text-lg">
              {hasRole('ADMIN') && 'Manage your faculty management system'}
              {hasRole('FACULTY') && 'Access your profile and publications'}
              {hasRole('STUDENT') && 'Explore faculty and courses'}
              {hasRole('HR') && 'Manage faculty and staff information'}
            </p>
          </div>
          <div className="hidden md:block">
            <Calendar className="w-16 h-16 text-indigo-200" />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stat.value}
              </div>
              <Link to={stat.link}>
                <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground">
                  View details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuickActions.map((action, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link to={action.link}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <action.icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {action.description}
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity (Placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            System Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-600">
            <p className="mb-2">
              The Faculty Management System is operational and serving {stats.totalFaculty} faculty members
              across {stats.totalDepartments} departments.
            </p>
            <p>
              Currently managing {stats.totalCourses} courses and tracking {stats.totalPublications} research publications.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
