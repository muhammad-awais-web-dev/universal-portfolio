# TODO - Portfolio Manager

## 🔥 Current Sprint: Cloudinary Integration

### Priority 1 - Image Upload Infrastructure
- [ ] Install and configure Cloudinary packages
- [ ] Set up Cloudinary credentials in `.env.local`
- [ ] Create reusable image upload component
- [ ] Implement signed upload for security
- [ ] Add upload progress indicator
- [ ] Handle upload errors gracefully

### Priority 2 - Bio Form Images
- [ ] Add avatar upload to Bio form
- [ ] Display uploaded avatar preview
- [ ] Allow avatar replacement
- [ ] Store Cloudinary public_id in state
- [ ] Add image deletion functionality

### Priority 3 - Project Images
- [ ] Add featured image upload to Project form
- [ ] Implement multiple image gallery upload
- [ ] Add image reordering functionality
- [ ] Show image thumbnails in project cards
- [ ] Add alt text support for images

### Priority 4 - Certification Images
- [ ] Add featured image upload to Certification form
- [ ] Implement optional image gallery
- [ ] Display featured image in certification cards

---

## 📦 Backlog

### LocalStorage (Temporary - Remove Later)
- [ ] **REMOVE localStorage implementation when Supabase is connected**
  - Currently using localStorage for testing/development
  - All save/load logic in `components/admin/portfolio-context.tsx`
  - Remove all localStorage useEffect hooks
  - Remove STORAGE_KEYS constant
  - Replace with API calls to Supabase

### Data Relationships
- [ ] Test skill multi-select functionality
- [ ] Test project multi-select in certifications/experience/education
- [ ] Add search/filter for skill selection
- [ ] Add search/filter for project selection
- [ ] Show related items count in cards

### UI/UX Improvements
- [x] **COMPLETED:** Hover-reveal edit/delete buttons (cleaner UI)
- [x] **COMPLETED:** Live image previews for URL fields
- [x] **COMPLETED:** HTML preview with prose styling
- [ ] Add loading states to forms
- [ ] Add success/error toast notifications
- [ ] Implement form validation
- [ ] Add confirmation dialogs for delete actions
- [ ] Improve mobile responsiveness
- [ ] Add drag-and-drop for image ordering
- [ ] Consider WYSIWYG editor as alternative to raw HTML

### Data Management
- [x] **COMPLETED:** Add edit functionality for all entities
  - Edit/delete buttons with hover-reveal UX
  - Image preview on blur for all URL fields
  - Body HTML fields with live preview (5 forms)
- [ ] Implement bulk delete
- [ ] Add export data feature (JSON)
- [ ] Add import data feature
- [ ] Add data backup/restore

### Supabase Backend
- [ ] Write SQL migration files
- [ ] Create all database tables
- [ ] Set up RLS policies
- [ ] Create API routes (Next.js Route Handlers)
- [ ] Implement server-side validation
- [ ] Add authentication middleware
- [ ] Connect forms to API endpoints
- [ ] Replace local state with database queries

### Image Optimization
- [ ] Set up Cloudinary transformations
- [ ] Generate responsive image sizes
- [ ] Add lazy loading for images
- [ ] Implement image compression
- [ ] Add webp format support

### Testing & Quality
- [ ] Write unit tests for components
- [ ] Write integration tests for forms
- [ ] Test API endpoints
- [ ] Add E2E tests
- [ ] Set up CI/CD pipeline

### Documentation
- [ ] Add JSDoc comments to components
- [ ] Document API endpoints
- [ ] Create database schema diagram
- [ ] Write deployment guide
- [ ] Add contribution guidelines

---

## 🐛 Known Issues

- None currently reported

---

## 💡 Ideas / Future Enhancements

- [ ] Add project templates/presets
- [ ] Implement version history for projects
- [ ] Add AI-powered description suggestions
- [ ] Create public portfolio preview mode
- [ ] Add analytics/stats dashboard
- [ ] Support multiple portfolio themes
- [ ] Add resume PDF export
- [ ] Implement project tagging system
- [ ] Add search across all entities
- [ ] Create portfolio sharing links
- [ ] Add collaboration features (comments, reviews)
- [ ] Implement SEO optimization tools
- [ ] Add portfolio performance metrics

---

## 📅 Timeline

**Week 1-2:** Cloudinary Integration
- Complete all image upload functionality
- Test and refine UI/UX

**Week 3-4:** Supabase Backend
- Database schema and migrations
- API implementation
- Connect frontend to backend

**Week 5-6:** Testing & Polish
- Testing and bug fixes
- Performance optimization
- Documentation

**Week 7+:** Public Portfolio Website
- Design and build public-facing site
- Consume data from API
- Deploy to production

---

## 🎯 Success Criteria

### Phase 2 (Cloudinary) Complete When:
- ✅ All image uploads working
- ✅ Images display correctly
- ✅ Can delete/replace images
- ✅ Cloudinary URLs stored properly
- ✅ No console errors

### Phase 3 (Supabase) Complete When:
- ✅ All data persists to database
- ✅ API routes functional
- ✅ Authentication re-enabled
- ✅ RLS policies working
- ✅ Forms connected to backend
- ✅ Data loads on page refresh

### Project Complete When:
- ✅ Full CRUD operations for all entities
- ✅ All relationships working
- ✅ Images upload and display
- ✅ Data persisted and secure
- ✅ Production-ready code
- ✅ Documentation complete
