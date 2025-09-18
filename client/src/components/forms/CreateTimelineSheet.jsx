import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { useError } from '../../context/ErrorContext';
import { timelineAPI } from '../../api';

const timelineSchema = z.object({
  year: z.string().min(4, 'Year must be at least 4 characters'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  achievement: z.string().min(10, 'Achievement must be at least 10 characters'),
  order: z.number().min(1, 'Order must be at least 1'),
});

const CreateTimelineSheet = ({ isOpen, onClose, onTimelineUpdate, timeline = null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addError } = useError();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(timelineSchema),
  });

  // Reset form when timeline changes
  useEffect(() => {
    if (timeline) {
      reset({
        year: timeline.year,
        title: timeline.title,
        description: timeline.description,
        achievement: timeline.achievement,
        order: timeline.order,
      });
    } else {
      reset({ year: '', title: '', description: '', achievement: '', order: 1 });
    }
  }, [timeline, reset]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      
      const timelineData = {
        year: data.year,
        title: data.title,
        description: data.description,
        achievement: data.achievement,
        order: Number(data.order),
      };

      if (timeline) {
        await timelineAPI.update(timeline._id, timelineData);
        addError('Timeline event updated successfully', 'success');
      } else {
        await timelineAPI.create(timelineData);
        addError('Timeline event created successfully', 'success');
      }

      onTimelineUpdate();
      reset();
    } catch (error) {
      addError(timeline ? 'Failed to update timeline event' : 'Failed to create timeline event');
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
      <SheetContent className="sm:max-w-md">
        <SheetHeader className={"text-left"}>
          <SheetTitle>
            {timeline ? 'تعديل حدث خط الزمن' : 'إنشاء حدث خط الزمن'}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6 px-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
                السنه
            </label>
            <Input
              {...register('year')}
              placeholder="2024"
              disabled={isLoading}
            />
            {errors.year && (
              <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              العنوان
            </label>
            <Input
              {...register('title')}
              placeholder="تأسيس الاتحاد"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              الوصف
            </label>
            <textarea
              {...register('description')}
              placeholder="صف ما حدث في هذه السنة..."
              rows={3}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              الإنجاز الرئيسي
            </label>
            <textarea
              {...register('achievement')}
              placeholder="ما هو الإنجاز الرئيسي في هذه السنة..."
              rows={3}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.achievement && (
              <p className="text-red-500 text-xs mt-1">{errors.achievement.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              الترتيب
            </label>
            <Input
              {...register('order', { valueAsNumber: true })}
              type="number"
              min="1"
              placeholder="1"
              disabled={isLoading}
            />
            {errors.order && (
              <p className="text-red-500 text-xs mt-1">{errors.order.message}</p>
            )}
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'جاري الحفظ...' : timeline ? 'تحديث' : 'إنشاء'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateTimelineSheet;