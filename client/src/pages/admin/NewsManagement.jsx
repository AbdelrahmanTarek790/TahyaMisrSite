import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useError } from '../../context/ErrorContext';
import { newsAPI } from '../../api';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

const newsSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  image: z.any().optional(),
});

const NewsManagement = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const { addError } = useError();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newsSchema),
  });

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

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      if (editingNews) {
        await newsAPI.update(editingNews._id, formData);
        addError('News updated successfully!', 'success');
      } else {
        await newsAPI.create(formData);
        addError('News created successfully!', 'success');
      }

      reset();
      setIsModalOpen(false);
      setEditingNews(null);
      fetchNews();
    } catch (error) {
      addError(error?.error || 'Failed to save news');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem);
    reset({
      title: newsItem.title,
      content: newsItem.content,
    });
    setIsModalOpen(true);
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
    reset({ title: '', content: '' });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
          <p className="text-gray-600">Create and manage news articles</p>
        </div>
        <Button onClick={handleNewNews}>
          <Plus className="mr-2 h-4 w-4" />
          Add News
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No news articles</h3>
                <p className="text-gray-600 mb-4">Get started by creating your first news article</p>
                <Button onClick={handleNewNews}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add News
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
                      src={`http://localhost:5000${newsItem.image}`}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingNews ? 'Edit News Article' : 'Create New News Article'}
              </CardTitle>
              <CardDescription>
                {editingNews ? 'Update the news article details' : 'Fill in the details for the new news article'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter news title"
                    {...register('title')}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <textarea
                    id="content"
                    rows={6}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Enter news content"
                    {...register('content')}
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Image (Optional)
                  </label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    {...register('image')}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingNews(null);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : editingNews ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NewsManagement;