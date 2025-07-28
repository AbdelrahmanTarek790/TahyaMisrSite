import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useError } from '../../context/ErrorContext';
import { usersAPI } from '../../api';
import { Search, Edit, Trash2, Eye, UserPlus, Shield, User } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const { addError } = useError();

  useEffect(() => {
    fetchUsers();
  }, [pagination.page]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await usersAPI.getAll({
        page: pagination.page,
        limit: pagination.limit,
      });
      setUsers(response.data?.users || []);
      setPagination(prev => ({
        ...prev,
        total: response.data?.total || 0,
      }));
    } catch (error) {
      addError('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await usersAPI.delete(userId);
      addError('User deleted successfully!', 'success');
      fetchUsers();
    } catch (error) {
      addError('Failed to delete user');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await usersAPI.update(userId, { role: newRole });
      addError('User role updated successfully!', 'success');
      fetchUsers();
    } catch (error) {
      addError('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.governorate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'volunteer':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-green-500" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'volunteer':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600">Manage users and their roles</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="volunteer">Volunteers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Users Table */}
      {isLoading && users.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterRole !== 'all' ? 'No users found' : 'No users available'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterRole !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Users will appear here once they register'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-3 font-medium">User</th>
                    <th className="text-left pb-3 font-medium">Role</th>
                    <th className="text-left pb-3 font-medium">University</th>
                    <th className="text-left pb-3 font-medium">Governorate</th>
                    <th className="text-left pb-3 font-medium">Joined</th>
                    <th className="text-left pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b">
                      <td className="py-4">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400">{user.phone}</div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(user.role)}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-sm">{user.university}</td>
                      <td className="py-4 text-sm">{user.governorate}</td>
                      <td className="py-4 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            className="text-xs rounded border border-gray-300 px-2 py-1"
                          >
                            <option value="student">Student</option>
                            <option value="volunteer">Volunteer</option>
                            <option value="admin">Admin</option>
                          </select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination.total > pagination.limit && !searchTerm && filterRole === 'all' && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1 || isLoading}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <Button
            variant="outline"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit) || isLoading}
          >
            Next
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'student').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Volunteers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'volunteer').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === 'admin').length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;