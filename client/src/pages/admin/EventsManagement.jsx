import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../components/ui/sheet';
import { useError } from '../../context/ErrorContext';
import { eventsAPI } from '../../api';
import { Plus, Edit, Trash2, Eye, Calendar, MapPin, Download, User, Phone, Mail, IdCard, Briefcase } from 'lucide-react';
import CreateEventSheet from '../../components/forms/CreateEventSheet';

const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [isUsersSheetOpen, setIsUsersSheetOpen] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const { addError } = useError();

  useEffect(() => {
    fetchEvents();
  }, [pagination.page]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await eventsAPI.getAll({
        page: pagination.page,
        limit: pagination.limit,
      });
      setEvents(response.data?.events || []);
      setPagination(prev => ({
        ...prev,
        total: response.data?.total || 0,
      }));
    } catch (error) {
      addError('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsSheetOpen(true);
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventsAPI.delete(eventId);
      addError('Event deleted successfully!', 'success');
      fetchEvents();
    } catch (error) {
      addError('Failed to delete event');
    }
  };

  const handleNewEvent = () => {
    setEditingEvent(null);
    setIsSheetOpen(true);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setEditingEvent(null);
  };

  const handleSheetSuccess = () => {
    fetchEvents();
  };

  const handleViewRegisteredUsers = async (event) => {
    try {
      setIsLoadingUsers(true);
      setSelectedEvent(event);
      const response = await eventsAPI.getRegisteredUsers(event._id);
      setRegisteredUsers(response.data?.registeredUsers || []);
      setIsUsersSheetOpen(true);
    } catch (error) {
      addError('Failed to fetch registered users');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleCloseUsersSheet = () => {
    setIsUsersSheetOpen(false);
    setSelectedEvent(null);
    setRegisteredUsers([]);
  };

  const handleExportCSV = () => {
    if (!registeredUsers.length) {
      addError('No users to export');
      return;
    }

    // Create CSV headers
    const headers = ['Name', 'Phone', 'National ID', 'Email', 'Position', 'University', 'Governorate', 'Registration Date'];
    
    // Create CSV rows
    const rows = registeredUsers.map(user => [
      user.name || '',
      user.phone || '',
      user.nationalId || '',
      user.email || '',
      user.position?.name || 'N/A',
      user.university || '',
      user.governorate || '',
      user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedEvent?.title || 'event'}_registered_users_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addError('CSV file downloaded successfully!', 'success');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600">Create and manage events</p>
        </div>
        <Button onClick={handleNewEvent}>
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Events List */}
      <div className="grid gap-6">
        {isLoading && events.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </CardContent>
          </Card>
        ) : events.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events</h3>
                <p className="text-gray-600 mb-4">Get started by creating your first event</p>
                <Button onClick={handleNewEvent}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {formatDate(event.date)}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {event.location}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewRegisteredUsers(event)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(event._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  {event.image && (
                    <img
                      src={`http://localhost:5000${event.image}`}
                      alt={event.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-gray-600 line-clamp-3">{event.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      Registrations: {event.registeredUsers?.length || 0} users
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
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

      {/* Event Creation/Editing Sheet */}
      <CreateEventSheet
        isOpen={isSheetOpen}
        onClose={handleSheetClose}
        onSuccess={handleSheetSuccess}
        editingEvent={editingEvent}
      />

      {/* Registered Users Sheet */}
      <Sheet open={isUsersSheetOpen} onOpenChange={setIsUsersSheetOpen}>
        <SheetContent className="w-full max-w-4xl">
          <SheetHeader>
            <SheetTitle>
              Registered Users - {selectedEvent?.title}
            </SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            {/* Export Button */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {registeredUsers.length} user{registeredUsers.length !== 1 ? 's' : ''} registered
              </p>
              <Button 
                onClick={handleExportCSV} 
                disabled={!registeredUsers.length}
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {/* Loading State */}
            {isLoadingUsers && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {/* No Users */}
            {!isLoadingUsers && registeredUsers.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No registered users</h3>
                  <p className="text-gray-600">No one has registered for this event yet.</p>
                </div>
              </div>
            )}

            {/* Users Table */}
            {!isLoadingUsers && registeredUsers.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-3 font-medium">User</th>
                      <th className="text-left pb-3 font-medium">Contact</th>
                      <th className="text-left pb-3 font-medium">ID & Position</th>
                      <th className="text-left pb-3 font-medium">Location</th>
                      <th className="text-left pb-3 font-medium">Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredUsers.map((user) => (
                      <tr key={user._id} className="border-b">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 rounded-full p-2">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.university}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span>{user.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-xs">{user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              <IdCard className="h-3 w-3 text-gray-400" />
                              <span className="font-mono">{user.nationalId}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Briefcase className="h-3 w-3 text-gray-400" />
                              <span>{user.position?.name || 'N/A'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-sm">{user.governorate}</td>
                        <td className="py-4 text-sm">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EventsManagement;