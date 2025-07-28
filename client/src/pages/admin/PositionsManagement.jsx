import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../../components/ui/sheet';
import { useError } from '../../context/ErrorContext';
import { positionsAPI } from '../../api';
import { Plus, Edit, Trash2, Users, MapPin, Building, Search } from 'lucide-react';

const positionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  department: z.string().min(2, 'Department must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  requirements: z.string().min(10, 'Requirements must be at least 10 characters'),
  type: z.enum(['full-time', 'part-time', 'volunteer', 'internship']),
  status: z.enum(['active', 'inactive', 'filled']).default('active'),
});

const PositionsManagement = () => {
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const { addError } = useError();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(positionSchema),
  });

  useEffect(() => {
    fetchPositions();
  }, [pagination.page]);

  const fetchPositions = async () => {
    try {
      setIsLoading(true);
      const response = await positionsAPI.getAll({
        page: pagination.page,
        limit: pagination.limit,
      });
      setPositions(response.data?.positions || []);
      setPagination(prev => ({
        ...prev,
        total: response.data?.total || 0,
      }));
    } catch (error) {
      addError('Failed to fetch positions');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      if (editingPosition) {
        await positionsAPI.update(editingPosition._id, data);
        addError('Position updated successfully!', 'success');
      } else {
        await positionsAPI.create(data);
        addError('Position created successfully!', 'success');
      }
      setIsSheetOpen(false);
      setEditingPosition(null);
      reset();
      fetchPositions();
    } catch (error) {
      addError(error.message || 'Failed to save position');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (position) => {
    setEditingPosition(position);
    reset({
      title: position.title,
      description: position.description,
      department: position.department,
      location: position.location,
      requirements: position.requirements,
      type: position.type,
      status: position.status,
    });
    setIsSheetOpen(true);
  };

  const handleDelete = async (positionId) => {
    if (!confirm('Are you sure you want to delete this position?')) return;

    try {
      await positionsAPI.delete(positionId);
      addError('Position deleted successfully!', 'success');
      fetchPositions();
    } catch (error) {
      addError('Failed to delete position');
    }
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setEditingPosition(null);
    reset();
  };

  const filteredPositions = positions.filter(position => {
    const matchesSearch = 
      position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || position.type === filterType;
    const matchesStatus = filterStatus === 'all' || position.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'filled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'full-time':
        return 'bg-purple-100 text-purple-800';
      case 'part-time':
        return 'bg-orange-100 text-orange-800';
      case 'volunteer':
        return 'bg-green-100 text-green-800';
      case 'internship':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Positions Management</h1>
          <p className="text-gray-600">Manage available positions and roles</p>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Position
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[600px] sm:max-w-[600px]">
            <SheetHeader>
              <SheetTitle>{editingPosition ? 'Edit Position' : 'Create New Position'}</SheetTitle>
            </SheetHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position Title
                </label>
                <Input
                  {...register('title')}
                  placeholder="Enter position title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md"
                  placeholder="Enter position description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <Input
                    {...register('department')}
                    placeholder="Enter department"
                  />
                  {errors.department && (
                    <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <Input
                    {...register('location')}
                    placeholder="Enter location"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </label>
                <textarea
                  {...register('requirements')}
                  className="w-full min-h-[80px] p-2 border border-gray-300 rounded-md"
                  placeholder="Enter position requirements"
                />
                {errors.requirements && (
                  <p className="text-red-500 text-sm mt-1">{errors.requirements.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position Type
                  </label>
                  <select
                    {...register('type')}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="internship">Internship</option>
                  </select>
                  {errors.type && (
                    <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="filled">Filled</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseSheet}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : editingPosition ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search positions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="volunteer">Volunteer</option>
                <option value="internship">Internship</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="filled">Filled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Positions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">Loading positions...</p>
          </div>
        ) : filteredPositions.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No positions found.</p>
          </div>
        ) : (
          filteredPositions.map((position) => (
            <Card key={position._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{position.title}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(position)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(position._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(position.type)}`}>
                    {position.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(position.status)}`}>
                    {position.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {position.description}
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>{position.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{position.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Created {new Date(position.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {Math.ceil(pagination.total / pagination.limit) > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm">
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <Button
            variant="outline"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default PositionsManagement;