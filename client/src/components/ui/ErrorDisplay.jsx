import { useEffect } from 'react';
import { useError } from '../../context/ErrorContext';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

const ErrorDisplay = () => {
  const { errors, removeError } = useError();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      case 'error':
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getColorClasses = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'error':
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  useEffect(() => {
    errors.forEach((error) => {
      const timer = setTimeout(() => {
        removeError(error.id);
      }, 5000);
      return () => clearTimeout(timer);
    });
  }, [errors, removeError]);

  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {errors.map((error) => (
        <div
          key={error.id}
          className={`
            flex items-center p-4 border rounded-lg shadow-md max-w-md
            ${getColorClasses(error.type)}
          `}
        >
          <div className="flex-shrink-0">
            {getIcon(error.type)}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{error.message}</p>
          </div>
          <button
            type="button"
            className="ml-3 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-600"
            onClick={() => removeError(error.id)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ErrorDisplay;