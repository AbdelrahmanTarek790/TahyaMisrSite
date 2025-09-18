import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useError } from '../../context/ErrorContext';
import { newsAPI } from '../../api';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import CreateNewsSheet from '../../components/forms/CreateNewsSheet';

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const { addError } = useError();

  useEffect(() => {
    fetchNews();
  }, [pagination.page]);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const response = await newsAPI.getAll({
        page: pagination.page,
        limit: pagination.limit,
      });
      setNews(response.data?.news || []);
      setPagination(prev => ({
        ...prev,
        total: response.data?.total || 0,
      }));
    } catch (error) {
      addError('Failed to fetch news');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    setIsSheetOpen(true);
  };

  const handleDelete = async (newsId) => {
    if (!confirm('Are you sure you want to delete this news article?')) return;

    try {
      await newsAPI.delete(newsId);
      addError('News deleted successfully!', 'success');
      fetchNews();
    } catch (error) {
      addError('Failed to delete news');
    }
  };

  const handleNewNews = () => {
    setEditingNews(null);
    setIsSheetOpen(true);
  };

  const handleSheetClose = () => {
    setIsSheetOpen(false);
    setEditingNews(null);
  };

  const handleSheetSuccess = () => {
    fetchNews();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة الأخبار</h1>
          <p className="text-gray-600">إنشاء وإدارة مقالات الأخبار</p>
        </div>
        <Button onClick={handleNewNews}>
          <Plus className="mr-2 h-4 w-4" />
          إضافة خبر
        </Button>
      </div>

      {/* News List */}
      <div className="grid gap-6">
        {isLoading && news.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </CardContent>
          </Card>
        ) : news.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مقالات أخبار</h3>
                <p className="text-gray-600 mb-4">ابدأ بإنشاء أول مقالة أخبارية لك</p>
                <Button onClick={handleNewNews}>
                  <Plus className="mr-2 h-4 w-4" />
                  إضافة خبر
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          news.map((newsItem) => (
            <Card key={newsItem._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{newsItem.title}</CardTitle>
                    <CardDescription>
                      Published on {new Date(newsItem.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(newsItem)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(newsItem._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  {newsItem.image && (
                    <img
                      src={`https://form.codepeak.software/uploads/${newsItem.image}`}
                      crossOrigin='anonymous'
                      alt={newsItem.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-gray-600 line-clamp-3">{newsItem.content}</p>
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

      {/* News Creation/Editing Sheet */}
      <CreateNewsSheet
        isOpen={isSheetOpen}
        onClose={handleSheetClose}
        onSuccess={handleSheetSuccess}
        editingNews={editingNews}
      />
    </div>
  );
};

export default NewsManagement;