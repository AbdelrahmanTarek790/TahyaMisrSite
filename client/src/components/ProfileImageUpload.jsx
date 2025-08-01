import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import ImageCropModal from './ImageCropModal';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Camera, Upload } from 'lucide-react';

const ProfileImageUpload = ({ value, onChange, error }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(value || null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageBlob) => {
    // Create a preview URL for the cropped image
    const previewUrl = URL.createObjectURL(croppedImageBlob);
    setCroppedImage(previewUrl);
    
    // Pass the blob to the parent component
    onChange(croppedImageBlob);
    setIsCropModalOpen(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setCroppedImage(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={croppedImage} alt="Profile" />
            <AvatarFallback className="text-2xl">
              <Camera className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          
          {croppedImage && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex flex-col items-center space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleUploadClick}
            className="flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>{croppedImage ? 'Change Photo' : 'Upload Photo'}</span>
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            Recommended: Square image, at least 200x200px
            <br />
            Supported formats: JPG, PNG (Max 5MB)
          </p>
        </div>
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}

      <ImageCropModal
        isOpen={isCropModalOpen}
        onClose={() => setIsCropModalOpen(false)}
        imageSrc={imageSrc}
        onCropComplete={handleCropComplete}
        aspectRatio={1}
      />
    </div>
  );
};

export default ProfileImageUpload;