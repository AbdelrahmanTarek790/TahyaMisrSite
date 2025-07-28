import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { useError } from '../../context/ErrorContext';
import { mediaAPI } from '../../api';

const mediaSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  file: z.any().refine((files) => files?.length > 0, 'File is required'),
});

const CreateMediaSheet = ({ isOpen, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addError } = useError();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(mediaSchema),
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('title', data.title);
      if (data.description) {
        formData.append('description', data.description);
      }
      if (data.file && data.file[0]) {
        formData.append('file', data.file[0]);
      }

      await mediaAPI.upload(formData);
      addError('Media uploaded successfully!', 'success');
      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      addError(error?.error || 'Failed to upload media');
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
          <SheetTitle>Upload Media</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              {...register('title')}
              placeholder="Enter media title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              {...register('description')}
              className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md"
              placeholder="Enter media description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File
            </label>
            <Input
              {...register('file')}
              type="file"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx"
            />
            {errors.file && (
              <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: Images, Videos, Audio, PDF, Word documents, PowerPoint presentations
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Uploading...' : 'Upload Media'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateMediaSheet;