import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { useError } from '../../context/ErrorContext';
import { eventsAPI } from '../../api';

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(3, 'Location must be at least 3 characters'),
  image: z.any().optional(),
});

const CreateEventSheet = ({ isOpen, onClose, onSuccess, editingEvent = null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addError } = useError();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
  });

  // Reset form when editingEvent changes
  useEffect(() => {
    if (editingEvent) {
      reset({
        title: editingEvent.title,
        description: editingEvent.description,
        date: new Date(editingEvent.date).toISOString().split('T')[0],
        location: editingEvent.location,
      });
    } else {
      reset({ title: '', description: '', date: '', location: '' });
    }
  }, [editingEvent, reset]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('date', data.date);
      formData.append('location', data.location);
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      if (editingEvent) {
        await eventsAPI.update(editingEvent._id, formData);
        addError('Event updated successfully!', 'success');
      } else {
        await eventsAPI.create(formData);
        addError('Event created successfully!', 'success');
      }
      
      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      addError(error?.error || `Failed to ${editingEvent ? 'update' : 'create'} event`);
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
          <SheetTitle>{editingEvent ? 'Edit Event' : 'Create Event'}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title
            </label>
            <Input
              {...register('title')}
              placeholder="Enter event title"
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
              className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md"
              placeholder="Enter event description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date & Time
              </label>
              <Input
                {...register('date')}
                type="datetime-local"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <Input
                {...register('location')}
                placeholder="Enter event location"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>
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
              {isLoading ? `${editingEvent ? 'Updating...' : 'Creating...'}` : `${editingEvent ? 'Update Event' : 'Create Event'}`}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateEventSheet;