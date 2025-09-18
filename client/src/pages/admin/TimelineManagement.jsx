import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useError } from '../../context/ErrorContext';
import { timelineAPI } from '../../api';
import { Plus, Edit, Trash2, Calendar, Trophy } from 'lucide-react';
import CreateTimelineSheet from '../../components/forms/CreateTimelineSheet';

const TimelineManagement = () => {
  const [timeline, setTimeline] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const { addError } = useError();

  useEffect(() => {
    fetchTimeline();
  }, [pagination.page]);

  const fetchTimeline = async () => {
    try {
      setIsLoading(true);
      const response = await timelineAPI.getAll({
        page: pagination.page,
        limit: pagination.limit,
      });
      setTimeline(response.data?.timeline || []);
      setPagination(prev => ({
        ...prev,
        total: response.data?.total || 0,
      }));
    } catch (error) {
      addError('Failed to fetch timeline events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (timelineItem) => {
    setEditingTimeline(timelineItem);
    setIsSheetOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this timeline event?')) {
      try {
        await timelineAPI.delete(id);
        fetchTimeline();
        addError('Timeline event deleted successfully', 'success');
      } catch (error) {
        addError('Failed to delete timeline event');
      }
    }
  };

  const handleCreateNew = () => {
    setEditingTimeline(null);
    setIsSheetOpen(true);
  };

  const onTimelineUpdate = () => {
    fetchTimeline();
    setIsSheetOpen(false);
    setEditingTimeline(null);
  };

  if (isLoading && timeline.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              اعدادات خط الزمن
            </h1>
            <p className="text-gray-600">إدارة أحداث الخط الزمني لقسم "رحلتنا من أجل التأثير"</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">اعدادات خط الزمن</h1>
          <p className="text-gray-600">إدارة أحداث الخط الزمني لقسم "رحلتنا من أجل التأثير"</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          إضافة حدث خط الزمن
        </Button>
      </div>

      {/* Timeline Grid */}
      {timeline.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد أحداث خط زمن</h3>
              <p className="text-gray-600 mb-4">ابدأ بإنشاء أول حدث خط زمن</p>
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Timeline Event
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timeline.map((timelineItem) => (
            <Card key={timelineItem._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="text-lg font-bold text-blue-600">{timelineItem.year}</span>
                  </div>
                  <span className="text-sm text-gray-500">Order: {timelineItem.order}</span>
                </div>
                <CardTitle className="text-xl line-clamp-2">{timelineItem.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {timelineItem.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 rounded-lg p-3 mb-4 border-l-4 border-green-500">
                  <div className="flex items-center space-x-2 mb-1">
                    <Trophy className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800 text-sm">Key Achievement</span>
                  </div>
                  <p className="text-green-700 text-sm line-clamp-2">{timelineItem.achievement}</p>
                </div>
                
                <div className="flex justify-between space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(timelineItem)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    تعديل
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(timelineItem._id)}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1 || isLoading}
          >
            السابق
          </Button>
          <span className="flex items-center px-4">
            الصفحة {pagination.page} من {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <Button
            variant="outline"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit) || isLoading}
          >
            التالي
          </Button>
        </div>
      )}

      {/* Create/Edit Sheet */}
      <CreateTimelineSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        timeline={editingTimeline}
        onTimelineUpdate={onTimelineUpdate}
      />
    </div>
  );
};

export default TimelineManagement;