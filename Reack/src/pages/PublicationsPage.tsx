import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, FileText, Edit, Trash2, Search, ExternalLink, Calendar, User } from 'lucide-react';
import { publicationService, facultyService } from '../api/services';
import { Publication, FacultyProfile, PublicationRequest } from '../types';
import { toast } from 'react-hot-toast';

const PublicationsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [publications, setPublications] = useState<Publication[]>([]);
  const [faculty, setFaculty] = useState<FacultyProfile[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [formData, setFormData] = useState<PublicationRequest>({
    facultyId: undefined,
    title: '',
    publicationDate: '',
    journalName: '',
    url: '',
    abstractText: '',
    doi: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPublications(publications);
    } else {
      const filtered = publications.filter(
        (pub) =>
          pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pub.journalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pub.abstractText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${pub.faculty.firstName} ${pub.faculty.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPublications(filtered);
    }
  }, [searchTerm, publications]);

  const fetchData = async () => {
    try {
      const [publicationsRes, facultyRes] = await Promise.all([
        publicationService.getAll(),
        facultyService.getAll(),
      ]);

      if (publicationsRes.data.success) {
        setPublications(publicationsRes.data.data);
        setFilteredPublications(publicationsRes.data.data);
      }

      if (facultyRes.data.success) {
        setFaculty(facultyRes.data.data);
      }
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPublication) {
        await publicationService.update(editingPublication.id, formData);
        toast.success('Publication updated successfully');
      } else {
        await publicationService.create(formData);
        toast.success('Publication created successfully');
      }
      
      setIsDialogOpen(false);
      setEditingPublication(null);
      setFormData({
        facultyId: undefined,
        title: '',
        publicationDate: '',
        journalName: '',
        url: '',
        abstractText: '',
        doi: '',
      });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save publication');
    }
  };

  const handleEdit = (publication: Publication) => {
    setEditingPublication(publication);
    setFormData({
      facultyId: publication.faculty.id,
      title: publication.title,
      publicationDate: publication.publicationDate.split('T')[0], // Convert to YYYY-MM-DD format
      journalName: publication.journalName || '',
      url: publication.url || '',
      abstractText: publication.abstractText || '',
      doi: publication.doi || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this publication?')) {
      return;
    }

    try {
      await publicationService.delete(id);
      toast.success('Publication deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete publication');
    }
  };

  const openCreateDialog = () => {
    setEditingPublication(null);
    setFormData({
      facultyId: undefined,
      title: '',
      publicationDate: '',
      journalName: '',
      url: '',
      abstractText: '',
      doi: '',
    });
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading publications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Publications</h1>
          <p className="text-gray-600 mt-1">
            Track and manage faculty research publications
          </p>
        </div>
        {(hasRole('ADMIN') || hasRole('FACULTY')) && (
          <Button onClick={openCreateDialog} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Publication
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search publications by title, author, journal, or abstract..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Publications List */}
      {filteredPublications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No publications found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'No publications match your search criteria.' : 'No publications have been added yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPublications.map((publication) => (
            <Card key={publication.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 leading-tight">
                      {publication.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>{publication.faculty.firstName} {publication.faculty.lastName}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(publication.publicationDate)}</span>
                      </div>
                      {publication.journalName && (
                        <div className="font-medium text-indigo-600">
                          {publication.journalName}
                        </div>
                      )}
                    </div>
                  </div>
                  {(hasRole('ADMIN') || hasRole('FACULTY')) && (
                    <div className="flex space-x-1 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(publication)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(publication.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {publication.abstractText && (
                    <CardDescription className="line-clamp-3">
                      {publication.abstractText}
                    </CardDescription>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    {publication.doi && (
                      <div className="text-gray-600">
                        <span className="font-medium">DOI:</span> {publication.doi}
                      </div>
                    )}
                    {publication.url && (
                      <a
                        href={publication.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Publication
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPublication ? 'Edit Publication' : 'Add New Publication'}
            </DialogTitle>
            <DialogDescription>
              {editingPublication 
                ? 'Update the publication information below.'
                : 'Enter the details for the new publication.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Publication title"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="faculty">Author (Faculty)</Label>
                  <Select
                    value={formData.facultyId?.toString()}
                    onValueChange={(value) => setFormData({ ...formData, facultyId: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select faculty member" />
                    </SelectTrigger>
                    <SelectContent>
                      {faculty.map((member) => (
                        <SelectItem key={member.id} value={member.id.toString()}>
                          {member.firstName} {member.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publicationDate">Publication Date</Label>
                  <Input
                    id="publicationDate"
                    type="date"
                    value={formData.publicationDate}
                    onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="journalName">Journal Name</Label>
                  <Input
                    id="journalName"
                    value={formData.journalName}
                    onChange={(e) => setFormData({ ...formData, journalName: e.target.value })}
                    placeholder="Journal or conference name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doi">DOI</Label>
                  <Input
                    id="doi"
                    value={formData.doi}
                    onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                    placeholder="Digital Object Identifier"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="Link to the publication"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="abstractText">Abstract</Label>
                <Textarea
                  id="abstractText"
                  value={formData.abstractText}
                  onChange={(e) => setFormData({ ...formData, abstractText: e.target.value })}
                  placeholder="Publication abstract or summary..."
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                {editingPublication ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PublicationsPage;
