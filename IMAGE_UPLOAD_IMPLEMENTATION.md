# Image Upload Implementation for Achievements and Activities

## Overview

This document describes the implementation of image upload functionality for Achievements and Activities features, supporting both file uploads and external URL inputs.

## Implementation Date

January 2025

---

## Backend Changes

### 1. Route Updates

#### `routes/achievements.js`

```javascript
const { upload } = require("../utils/upload")

// Added upload middleware to POST and PUT routes
router.post("/", protect, authorize("admin"), ...upload.single("image", "default"), createAchievement)
router.put("/:id", protect, authorize("admin"), ...upload.single("image", "default"), updateAchievement)
```

#### `routes/activities.js`

```javascript
const { upload } = require("../utils/upload")

// Added upload middleware to POST and PUT routes
router.post("/", protect, authorize("admin"), ...upload.single("image", "default"), createActivity)
router.put("/:id", protect, authorize("admin"), ...upload.single("image", "default"), updateActivity)
```

**Key Features:**

-   Uses the existing Sharp-based upload utility
-   Automatically processes images to WebP format
-   Applies default resize settings (1200x800, quality 85)
-   Supports single file upload with field name "image"

### 2. Controller Updates

#### `achievementController.js`

**createAchievement:**

```javascript
// Handle image upload
let imagePath = req.body.image
if (req.file) {
    imagePath = `/uploads/${req.file.filename}`
}

const achievement = await Achievement.create({
    // ...other fields
    image: imagePath,
})
```

**updateAchievement:**

```javascript
// Handle image upload
if (req.file) {
    achievement.image = `/uploads/${req.file.filename}`
} else if (req.body.image !== undefined) {
    achievement.image = req.body.image
}
```

#### `activityController.js`

Same pattern as achievements - supports both file uploads and URL strings.

**Logic:**

1. If `req.file` exists → uploaded file takes priority → save as `/uploads/filename.webp`
2. If no file but `req.body.image` exists → use the URL string
3. If neither exists → image remains null/undefined

---

## Frontend Changes

### 1. Admin Page State Management

Both `AchievementsManagement.jsx` and `ActivitiesManagement.jsx` now include:

```javascript
const [imageFile, setImageFile] = useState(null)
const [imagePreview, setImagePreview] = useState("")
```

### 2. Image Handling Functions

**handleImageChange:**

```javascript
const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
        setImageFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
    }
}
```

**handleEdit (updated):**

```javascript
const handleEdit = (item) => {
    // ...set form data
    setImagePreview(item.image || "")
    setImageFile(null)
    setDialogOpen(true)
}
```

**resetForm (updated):**

```javascript
const resetForm = () => {
    // ...reset form data
    setImageFile(null)
    setImagePreview("")
}
```

### 3. Form Submission with FormData

**handleSubmit (updated):**

```javascript
const handleSubmit = async (e) => {
    e.preventDefault()

    try {
        const data = new FormData()
        data.append("title", formData.title)
        data.append("description", formData.description)
        // ...other fields

        // Add image file if selected, otherwise add URL if provided
        if (imageFile) {
            data.append("image", imageFile)
        } else if (formData.image) {
            data.append("image", formData.image)
        }

        if (editingAchievement) {
            await achievementsAPI.update(editingAchievement._id, data)
        } else {
            await achievementsAPI.create(data)
        }
        // ...rest of logic
    } catch (error) {
        // ...error handling
    }
}
```

**Important Changes:**

-   Changed from JSON object to `FormData` for file upload support
-   Highlights array converted with `JSON.stringify()` for FormData compatibility
-   Axios automatically sets `Content-Type: multipart/form-data` for FormData

### 4. Form UI Updates

#### Achievements Form

```jsx
<div>
    <Label htmlFor="imageFile" className="font-arabic">
        تحميل صورة
    </Label>
    <Input
        id="imageFile"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="cursor-pointer"
    />
    {imagePreview && (
        <div className="mt-2">
            <img
                src={imagePreview.startsWith('/')
                    ? `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imagePreview}`
                    : imagePreview}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg"
            />
        </div>
    )}
</div>

<div>
    <Label htmlFor="image" className="font-arabic">
        أو أدخل رابط الصورة
    </Label>
    <Input
        id="image"
        value={formData.image}
        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        placeholder="https://example.com/image.jpg"
        disabled={!!imageFile}
    />
</div>
```

#### Activities Form

Same structure as Achievements form.

**Key Features:**

-   File input accepts only images (`accept="image/*"`)
-   Live preview of selected image
-   Server images prefixed with API URL
-   URL input disabled when file is selected
-   Arabic labels and RTL support

---

## Image Processing Pipeline

### Upload Flow

```
User selects image
    ↓
FileReader creates preview (base64)
    ↓
User submits form
    ↓
Frontend sends FormData with file
    ↓
Multer middleware captures file (memory storage)
    ↓
Sharp middleware processes:
    - Resizes to max 1200x800
    - Converts to WebP format
    - Compresses to quality 85
    - Saves to uploads/ directory
    ↓
Controller receives req.file.filename
    ↓
Saves path as "/uploads/filename.webp"
    ↓
Frontend displays uploaded image
```

### Image Processing Settings (from upload.js)

```javascript
default: {
    width: 1200,
    height: 800,
    quality: 85,
    fit: "inside", // Maintains aspect ratio
}
```

**Benefits:**

-   ✅ Automatic format conversion to WebP
-   ✅ Optimal compression for web delivery
-   ✅ Consistent image sizing
-   ✅ Maintains aspect ratio
-   ✅ Reduces storage and bandwidth

---

## API Usage Examples

### Creating Achievement with File Upload

```javascript
const formData = new FormData()
formData.append("title", "إنجاز جديد")
formData.append("description", "وصف الإنجاز")
formData.append("highlights", JSON.stringify(["محور 1", "محور 2"]))
formData.append("image", imageFile) // File object from input
formData.append("icon", "Award")
formData.append("color", "text-egypt-gold")
formData.append("order", 1)
formData.append("isActive", true)

await achievementsAPI.create(formData)
```

### Creating Achievement with URL

```javascript
const formData = new FormData()
formData.append("title", "إنجاز جديد")
formData.append("description", "وصف الإنجاز")
formData.append("highlights", JSON.stringify(["محور 1", "محور 2"]))
formData.append("image", "https://example.com/image.jpg") // URL string
formData.append("icon", "Award")
formData.append("color", "text-egypt-gold")
formData.append("order", 1)
formData.append("isActive", true)

await achievementsAPI.create(formData)
```

### Updating Activity with File

```javascript
const formData = new FormData()
formData.append("title", "نشاط محدث")
formData.append("image", imageFile) // New file
formData.append("color", "bg-gradient-to-br from-egypt-red to-egypt-gold")
formData.append("order", 2)
formData.append("isActive", true)

await activitiesAPI.update(activityId, formData)
```

---

## Environment Configuration

### Required Environment Variables

```env
# Backend (.env)
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760  # 10MB in bytes
```

### Frontend Environment Variables

```env
# Frontend (.env)
VITE_API_URL=http://localhost:5000  # Backend server URL
```

---

## File Structure

```
Backend:
├── uploads/                     - Uploaded images directory
│   └── image-1234567890.webp   - Processed images
├── utils/
│   └── upload.js               - Image processing utility
├── controllers/
│   ├── achievementController.js - Updated with file handling
│   └── activityController.js    - Updated with file handling
└── routes/
    ├── achievements.js          - Added upload middleware
    └── activities.js            - Added upload middleware

Frontend:
└── src/
    └── pages/admin/
        ├── AchievementsManagement.jsx - File upload UI
        └── ActivitiesManagement.jsx   - File upload UI
```

---

## Image Display

### In Admin Pages

Images are displayed with the correct URL:

```javascript
src={imagePreview.startsWith('/')
    ? `${import.meta.env.VITE_API_URL}${imagePreview}`
    : imagePreview}
```

-   Server images: `http://localhost:5000/uploads/image.webp`
-   External URLs: Direct URL
-   Preview (before upload): `data:image/...` base64

### In Public Features Page

Update required to display uploaded images:

```javascript
// In Features.jsx
<img src={achievement.image.startsWith("/") ? `${import.meta.env.VITE_API_URL}${achievement.image}` : achievement.image} alt={achievement.title} />
```

---

## Testing Checklist

### Backend Testing

-   [ ] Upload image file via POST /achievements
-   [ ] Upload image file via POST /activities
-   [ ] Update achievement with new image file
-   [ ] Update activity with new image file
-   [ ] Create with URL instead of file
-   [ ] Update with URL instead of file
-   [ ] Verify WebP conversion
-   [ ] Verify file saved in uploads/ directory
-   [ ] Test max file size limit (10MB)
-   [ ] Test invalid file types (should reject)

### Frontend Testing

-   [ ] Select image file and see preview
-   [ ] Submit form with uploaded image
-   [ ] Edit item and see existing image preview
-   [ ] Replace existing image with new upload
-   [ ] Use URL input instead of file upload
-   [ ] Verify URL input disabled when file selected
-   [ ] Test with server-uploaded images
-   [ ] Test with external URL images
-   [ ] Verify images display correctly in list view
-   [ ] Test responsive image display

### Integration Testing

-   [ ] Upload image → Save → Refresh → Image persists
-   [ ] Upload image → Toggle active → Image displays on public page
-   [ ] Edit image → Old image replaced in database
-   [ ] Delete item → Verify image still exists (no auto-cleanup yet)

---

## Known Limitations & Future Enhancements

### Current Limitations

1. **No image deletion:** When updating/deleting items, old images remain in uploads/ folder
2. **No validation:** File size validation on frontend needed
3. **No progress indicator:** Large uploads have no visual feedback
4. **No cropping:** Users can't crop images before upload

### Planned Enhancements

1. **Image cleanup:** Auto-delete old images when updating/deleting items
2. **Frontend validation:** Check file size and type before upload
3. **Upload progress:** Show progress bar for large files
4. **Image cropping:** Add crop tool before upload
5. **Multiple images:** Support multiple images per item
6. **CDN integration:** Store images on CDN instead of local uploads/
7. **Image optimization:** Additional compression options

---

## Troubleshooting

### Issue: Images not uploading

**Solution:**

-   Check uploads/ directory exists and has write permissions
-   Verify MAX_FILE_SIZE environment variable
-   Check browser console for errors
-   Ensure multer and sharp packages are installed

### Issue: Images not displaying

**Solution:**

-   Verify VITE_API_URL is set correctly
-   Check image path format in database
-   Ensure Express serves static files from uploads/
-   Check browser network tab for 404 errors

### Issue: Image preview not showing

**Solution:**

-   Verify FileReader is supported (all modern browsers)
-   Check imagePreview state is being set
-   Ensure imagePreview conditional render is correct

### Issue: FormData not sending

**Solution:**

-   Don't set Content-Type header manually
-   Let Axios/fetch set multipart/form-data automatically
-   Verify all formData.append() calls have correct values

---

## Security Considerations

### Implemented

✅ File type validation (images only)
✅ File size limit (10MB)
✅ Admin-only upload routes
✅ JWT authentication required
✅ Automatic WebP conversion (safer format)

### Recommended

⚠️ Add virus scanning for uploaded files
⚠️ Add rate limiting for upload endpoints
⚠️ Validate image dimensions
⚠️ Add CSRF protection
⚠️ Sanitize filenames more thoroughly
⚠️ Consider signed URLs for sensitive images

---

## Performance Optimization

### Current Optimizations

-   WebP format reduces file size by 25-35%
-   Images resized to max 1200x800
-   Quality compression (85) balances quality vs size
-   Sharp processing is fast and efficient

### Additional Optimizations

-   Add lazy loading for images
-   Implement responsive images with srcset
-   Add image caching headers
-   Consider thumbnail generation
-   Implement progressive image loading

---

## Documentation References

-   [Multer Documentation](https://github.com/expressjs/multer)
-   [Sharp Documentation](https://sharp.pixelplumbing.com/)
-   [FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
-   [FileReader API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)

---

## Changelog

### Version 1.0.0 (January 2025)

-   ✅ Added file upload support to achievements routes
-   ✅ Added file upload support to activities routes
-   ✅ Updated controllers to handle file uploads
-   ✅ Added image preview in admin forms
-   ✅ Implemented dual input (file or URL)
-   ✅ Converted submissions to FormData
-   ✅ Added image processing with Sharp
-   ✅ Complete documentation

---

## Contributors

Implemented as part of Tahya Misr website full-stack development.
