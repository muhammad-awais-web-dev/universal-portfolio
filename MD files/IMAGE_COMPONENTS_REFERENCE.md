# Image Components Quick Reference

## Component Imports

```tsx
import { ImageUpload } from '@/components/ui/image-upload';
import { MultipleImageUpload } from '@/components/ui/multiple-image-upload';
import { ImageUrlModal } from '@/components/ui/image-url-modal';
import { ImageLibraryModal } from '@/components/ui/image-library-modal';
```

## 1. ImageUpload - Single Image

### Basic Usage
```tsx
<ImageUpload
  value={imageUrl}
  onChange={(url, publicId) => setImageUrl(url)}
  onDelete={() => setImageUrl('')}
/>
```

### Full Configuration
```tsx
<ImageUpload
  value={formData.featured_image}
  onChange={(url, publicId) => {
    setFormData({ ...formData, featured_image: url });
  }}
  onDelete={() => {
    setFormData({ ...formData, featured_image: "" });
  }}
  folder="portfolio/projects"
  publicIdPrefix={`project_${formData.slug}`}
  aspectRatio="16:9"
  maxSize={10}
  className="custom-class"
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `undefined` | Current image URL |
| `onChange` | `(url: string, publicId: string) => void` | Required | Callback when image changes |
| `onDelete` | `() => void` | `undefined` | Callback when image is deleted |
| `folder` | `string` | `'portfolio'` | Cloudinary folder path |
| `publicIdPrefix` | `string` | `undefined` | Custom filename prefix |
| `aspectRatio` | `string` | `undefined` | e.g., "16:9", "1:1", "4:3" |
| `maxSize` | `number` | `10` | Max file size in MB |
| `className` | `string` | `''` | Additional CSS classes |

---

## 2. MultipleImageUpload - Image Gallery

### Basic Usage
```tsx
<MultipleImageUpload
  images={imageUrls}
  onChange={(urls) => setImageUrls(urls)}
/>
```

### Full Configuration
```tsx
<MultipleImageUpload
  images={formData.image_gallery || []}
  onChange={(images) => {
    setFormData({ ...formData, image_gallery: images });
  }}
  folder="portfolio/projects/gallery"
  publicIdPrefix={`project_${formData.slug}_gallery`}
  maxImages={10}
/>
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `images` | `string[]` | Required | Array of image URLs |
| `onChange` | `(images: string[]) => void` | Required | Callback when images change |
| `folder` | `string` | `'portfolio'` | Cloudinary folder path |
| `publicIdPrefix` | `string` | `'image'` | Custom filename prefix |
| `maxImages` | `number` | `10` | Maximum number of images |

### Key Features
- Drag-and-drop reordering
- Individual image deletion
- Three upload methods (Upload, URL, Library)
- Numbered position indicators
- Image count display

---

## 3. ImageUrlModal - URL Input

### Usage
```tsx
const [showUrlModal, setShowUrlModal] = useState(false);

// In JSX
{showUrlModal && (
  <ImageUrlModal
    isOpen={showUrlModal}
    onClose={() => setShowUrlModal(false)}
    onSubmit={(url) => {
      setImageUrl(url);
      setShowUrlModal(false);
    }}
  />
)}
```

### Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | Yes | Controls modal visibility |
| `onClose` | `() => void` | Yes | Callback to close modal |
| `onSubmit` | `(url: string) => void` | Yes | Callback with entered URL |

---

## 4. ImageLibraryModal - Browse Library

### Usage
```tsx
const [showLibrary, setShowLibrary] = useState(false);

// In JSX
{showLibrary && (
  <ImageLibraryModal
    isOpen={showLibrary}
    onClose={() => setShowLibrary(false)}
    onSelect={(url) => {
      setImageUrl(url);
      setShowLibrary(false);
    }}
    folder="portfolio"
  />
)}
```

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | Required | Controls modal visibility |
| `onClose` | `() => void` | Required | Callback to close modal |
| `onSelect` | `(url: string) => void` | Required | Callback with selected URL |
| `folder` | `string` | `undefined` | Filter by folder (optional) |

### Features
- Search images by name
- Grid view with previews
- Bulk delete with multi-select
- Inline rename functionality
- Image name display

---

## API Routes Reference

### 1. Upload Signature
```tsx
// POST /api/upload
const response = await fetch('/api/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    folder: 'portfolio/projects',
    public_id: 'project_myslug_123456',
    timestamp: Math.round(Date.now() / 1000),
  }),
});
const { signature } = await response.json();
```

### 2. List Images
```tsx
// GET /api/cloudinary/list?folder=portfolio/projects
const response = await fetch('/api/cloudinary/list?folder=portfolio/projects');
const { images } = await response.json();
```

### 3. Rename Image
```tsx
// POST /api/cloudinary/rename
await fetch('/api/cloudinary/rename', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    oldPublicId: 'portfolio/projects/old_name',
    newPublicId: 'portfolio/projects/new_name',
  }),
});
```

### 4. Delete Images
```tsx
// DELETE /api/cloudinary/delete
await fetch('/api/cloudinary/delete', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    publicIds: ['portfolio/projects/image1', 'portfolio/projects/image2'],
  }),
});
```

### 5. Transform Image
```tsx
// POST /api/cloudinary/transform
const response = await fetch('/api/cloudinary/transform', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    publicId: 'portfolio/projects/myimage',
    transformations: {
      width: 800,
      height: 600,
      crop: 'fill',
      quality: 'auto',
      format: 'webp',
    },
  }),
});
const { url } = await response.json();
```

---

## Common Patterns

### 1. Form State with Single Image
```tsx
const [formData, setFormData] = useState({
  title: '',
  featured_image: '',
});

<ImageUpload
  value={formData.featured_image}
  onChange={(url) => setFormData(prev => ({ ...prev, featured_image: url }))}
  onDelete={() => setFormData(prev => ({ ...prev, featured_image: '' }))}
/>
```

### 2. Form State with Image Gallery
```tsx
const [formData, setFormData] = useState({
  title: '',
  featured_image: '',
  image_gallery: [],
});

<MultipleImageUpload
  images={formData.image_gallery}
  onChange={(images) => setFormData(prev => ({ ...prev, image_gallery: images }))}
/>
```

### 3. Dynamic Folder Based on Context
```tsx
const folder = type === 'project' 
  ? 'portfolio/projects' 
  : 'portfolio/certifications';

const publicIdPrefix = `${type}_${slug}`;

<ImageUpload
  folder={folder}
  publicIdPrefix={publicIdPrefix}
  {...otherProps}
/>
```

### 4. Conditional Auto-naming
```tsx
<ImageUpload
  folder="portfolio/projects"
  publicIdPrefix={formData.slug ? `project_${formData.slug}` : "project"}
/>
```

---

## Cloudinary Folder Structure

```
portfolio/
├── avatars/              # User avatars
│   └── avatar_1234567890.jpg
├── projects/             # Project featured images
│   ├── project_myslug_1234567890.jpg
│   └── gallery/          # Project galleries
│       ├── project_myslug_gallery_1234567890_0.jpg
│       └── project_myslug_gallery_1234567890_1.jpg
├── certifications/       # Certification images
│   ├── cert_aws_1234567890.jpg
│   └── gallery/          # Certification galleries
│       └── cert_aws_gallery_1234567890_0.jpg
└── skills/               # Skill logos
    └── skill_react_1234567890.png
```

---

## Auto-naming Convention

### Pattern
```
{type}_{identifier}_{timestamp}[_index]
```

### Examples
- Avatar: `avatar_1704067200000`
- Project: `project_my-awesome-app_1704067200000`
- Project Gallery: `project_my-awesome-app_gallery_1704067200000_0`
- Certification: `cert_aws_certified_1704067200000`
- Skill: `skill_react_1704067200000`

### Benefits
- **Unique names:** Timestamp prevents conflicts
- **Searchable:** Easy to find related images
- **Organized:** Clear naming convention
- **Sortable:** Chronological ordering

---

## Best Practices

### 1. Always Provide Context
```tsx
// ✅ Good: Context-aware naming
publicIdPrefix={`project_${slug}`}

// ❌ Bad: Generic naming
publicIdPrefix="image"
```

### 2. Set Appropriate Max Sizes
```tsx
// ✅ Good: Appropriate for use case
<ImageUpload maxSize={5} />  // Profile pictures
<ImageUpload maxSize={10} /> // Project images

// ❌ Bad: Too large
<ImageUpload maxSize={50} />
```

### 3. Use Folders for Organization
```tsx
// ✅ Good: Organized structure
folder="portfolio/projects/gallery"

// ❌ Bad: Flat structure
folder="portfolio"
```

### 4. Handle Deletion Properly
```tsx
// ✅ Good: Clear state
onDelete={() => setFormData(prev => ({ ...prev, featured_image: '' }))}

// ❌ Bad: No cleanup
onDelete={() => {}}
```

### 5. Validate Before Upload
```tsx
// ✅ Good: Component handles validation
<ImageUpload maxSize={10} />  // Built-in validation

// ❌ Bad: No validation
// Just trust user input
```

---

## Troubleshooting

### Image Not Uploading
1. Check environment variables are set
2. Verify Cloudinary credentials
3. Check browser console for errors
4. Ensure file size is within limits
5. Verify file type is image

### Image Not Displaying
1. Check URL is valid
2. Verify CORS settings on Cloudinary
3. Check network tab for 404 errors
4. Ensure public_id is correct
5. Try accessing URL directly in browser

### Bulk Delete Not Working
1. Check if images are selected
2. Verify API route is accessible
3. Check Cloudinary API permissions
4. Look for error messages in console
5. Ensure public_ids are correct

### Rename Failing
1. Verify new name is valid
2. Check for naming conflicts
3. Ensure API route has correct credentials
4. Look for Cloudinary API errors
5. Check network requests

---

## Quick Testing Commands

### Test Upload API
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Content-Type: application/json" \
  -d '{"folder":"portfolio","public_id":"test","timestamp":1704067200}'
```

### Test List API
```bash
curl http://localhost:3000/api/cloudinary/list?folder=portfolio
```

### Test Rename API
```bash
curl -X POST http://localhost:3000/api/cloudinary/rename \
  -H "Content-Type: application/json" \
  -d '{"oldPublicId":"portfolio/old","newPublicId":"portfolio/new"}'
```

### Test Delete API
```bash
curl -X DELETE http://localhost:3000/api/cloudinary/delete \
  -H "Content-Type: application/json" \
  -d '{"publicIds":["portfolio/test1","portfolio/test2"]}'
```

---

**Need more help?** See [IMAGE_MANAGEMENT_SUMMARY.md](./IMAGE_MANAGEMENT_SUMMARY.md) for detailed documentation.
