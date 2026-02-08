# Cloudinary Setup Instructions

## 1. Create Upload Preset

You need to create an **unsigned upload preset** in your Cloudinary account:

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Navigate to **Settings** → **Upload** → **Upload presets**
3. Click **Add upload preset**
4. Set the following:
   - **Preset name**: `portfolio_upload`
   - **Signing Mode**: **Unsigned** (for simplicity during development)
   - **Folder**: Leave empty (we'll specify folder in code)
   - **Use filename or externally defined Public ID**: Check this option
   - **Unique filename**: Check this to avoid name conflicts
5. Click **Save**

## 2. Current Configuration

Your `.env.local` file is configured with:
```
```

## 3. Usage

The `ImageUpload` component is ready to use:

```tsx
import { ImageUpload } from '@/components/ui/image-upload';

// In your form:
<ImageUpload
  value={avatarUrl}
  onChange={(url, publicId) => {
    setAvatarUrl(url);
    // Store publicId if you need to delete images later
  }}
  onDelete={() => setAvatarUrl('')}
  folder="portfolio/avatars"
  aspectRatio="1:1"
  maxSize={5}
/>
```

## 4. Features

### Single Image Upload (ImageUpload Component)
- ✅ Three upload methods: Direct upload, URL input, Library selection
- ✅ File type validation (images only)
- ✅ File size validation (configurable, default 10MB)
- ✅ Upload progress indicator
- ✅ Error handling with user-friendly messages
- ✅ Auto-naming based on context (e.g., `project_myslug`, `cert_certification_name`)
- ✅ Image preview with delete option
- ✅ Cloudinary folder organization

### Multiple Image Gallery (MultipleImageUpload Component)
- ✅ Upload multiple images at once
- ✅ Three upload methods for each image
- ✅ Drag-and-drop reordering
- ✅ Individual image deletion
- ✅ Gallery preview grid
- ✅ Configurable maximum images (default 10)
- ✅ Position indicators

### Image Library Management (ImageLibraryModal Component)
- ✅ Browse all uploaded images by folder
- ✅ Search functionality
- ✅ Bulk delete with confirmation
- ✅ Rename images
- ✅ Display image names
- ✅ Grid view with previews

### API Routes
- `/api/upload` - Generate upload signatures (signed uploads)
- `/api/cloudinary/list` - List images from folders
- `/api/cloudinary/rename` - Rename images
- `/api/cloudinary/delete` - Bulk delete images
- `/api/cloudinary/transform` - Generate transformation URLs
- ✅ Image preview at the top
- ✅ Three upload methods with button interface
- ✅ Delete button on preview
- ✅ Folder organization in Cloudinary
- ✅ Aspect ratio suggestions (UI hint only)
- ✅ **Auto-naming based on context** (e.g., `project_slug_timestamp`)
- ✅ **Image Library** - Browse and select previously uploaded images from Cloudinary

## 4.1 Three Upload Methods

The ImageUpload component provides **three convenient ways** to add images:

### 1. Upload Image (Direct Upload)
- Click the "Upload Image" button
- Select a file from your computer
- Automatic upload to Cloudinary
- Auto-naming with context + timestamp
- Progress indicator during upload

### 2. From URL
- Click the "From URL" button
- Opens a modal with URL input field
- Paste any valid image URL
- Live preview before confirming
- Supports external image hosting

### 3. From Library
- Click the "From Library" button
- Opens a modal showing all previously uploaded images
- Search functionality to filter images
- Grid view of all images in the folder
- Click to select and use existing images

### UI Design:
```
┌─────────────────────────────────────┐
│                                     │
│        Image Preview Area           │
│     (with delete button on top)     │
│                                     │
└─────────────────────────────────────┘
┌───────────┬───────────┬─────────────┐
│  Upload   │   From    │    From     │
│   Image   │    URL    │   Library   │
└───────────┴───────────┴─────────────┘
```

## 5. Auto-Naming Feature

Images are automatically renamed based on their context to maintain organization:

**Naming Patterns:**
- **Avatars**: `avatar_1707350400000`
- **Projects**: `project_my-awesome-project_1707350400000`
- **Certifications**: `cert_aws_certified_architect_1707350400000`
- **Skills**: `skill_react_1707350400000`

The timestamp ensures uniqueness and prevents naming conflicts when updating images.

**How it works:**
```tsx
<ImageUpload
  publicIdPrefix={formData.slug ? `project_${formData.slug}` : "project"}
  // ... other props
/>
```

The component appends a timestamp automatically: `prefix_timestamp`

## 6. Current Implementations

All forms now support **three upload methods** with a unified button interface:

### Bio Form (Avatar)
- **Upload**: Direct file upload to `portfolio/avatars`
  - Naming: `avatar_timestamp`
  - Max size: 5MB
  - Aspect ratio: 1:1
- **From URL**: Paste existing image URL via modal
- **From Library**: Browse uploaded avatars

### Project Form (Featured Image)
- **Upload**: Direct file upload to `portfolio/projects`
  - Naming: `project_slug_timestamp`
  - Max size: 10MB
  - Aspect ratio: 16:9
- **From URL**: Paste existing image URL via modal
- **From Library**: Browse uploaded project images

### Certification Form (Certificate Image)
- **Upload**: Direct file upload to `portfolio/certifications`
  - Naming: `cert_title_timestamp`
  - Max size: 5MB
  - Aspect ratio: 16:9
- **From URL**: Paste existing image URL via modal
- **From Library**: Browse uploaded certifications

### Skill Form (Logo)
- **Upload**: Direct file upload to `portfolio/skills`
  - Naming: `skill_name_timestamp`
  - Max size: 2MB
  - Aspect ratio: 1:1
- **From URL**: Paste existing image URL via modal
- **From Library**: Browse uploaded skill logos

## 7. Next Steps

1. **Create the upload preset** in Cloudinary console (see step 1)
2. **Test the upload** by adding images in each form
3. **Optional**: Switch to signed uploads for production by:
   - Changing preset to "signed" mode
   - Using the `/api/upload` route for signature generation
   - Updating the component to use signed uploads

## 8. Folder Structure in Cloudinary

Suggested folder organization:
```
portfolio/
  ├── avatars/       # Profile pictures
  ├── projects/      # Project featured images
  ├── galleries/     # Project image galleries
  ├── certifications/# Certification images
  └── skills/        # Skill logos
```

## 9. Image Transformations

You can add transformations to optimize images:
- Resize: `c_fill,w_800,h_600`
- Quality: `q_auto`
- Format: `f_auto` (automatic format selection)

Example URL:
```
https://res.cloudinary.com/dmk7l11w7/image/upload/c_fill,w_800,h_600,q_auto,f_auto/portfolio/avatars/image.jpg
```
