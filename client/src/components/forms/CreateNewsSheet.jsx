import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { useError } from '../../context/ErrorContext';
import { newsAPI } from '../../api';

const newsSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  image: z.any().optional(),
});

const CreateNewsSheet = ({ isOpen, onClose, onSuccess, editingNews = null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addError } = useError();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newsSchema),
  });

  // Reset form when editingNews changes
  useEffect(() => {
    if (editingNews) {
      reset({
        title: editingNews.title,
        content: editingNews.content,
      });
    } else {
      reset({ title: '', content: '' });
    }
  }, [editingNews, reset]);

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
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      addError(error?.error || `Failed to ${editingNews ? 'update' : 'create'} news`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-[600px] sm:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>{editingNews ? 'Edit News Article' : 'Create News Article'}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              {...register('title')}
              placeholder="Enter news title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              {...register('content')}
              className="w-full min-h-[150px] p-3 border border-gray-300 rounded-md"
              placeholder="Enter news content"
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image (Optional)
            </label>
            <Input
              {...register('image')}
              type="file"
              accept="image/*"
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? `${editingNews ? 'Updating...' : 'Creating...'}` : `${editingNews ? 'Update News' : 'Create News'}`}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateNewsSheet;