# Gallery Management Feature - Documentation

## Overview

The Gallery Management feature allows administrators to manage a collection of images that will be displayed on the home page. This is separate from event poster images and provides a dedicated space for showcasing department photos, achievements, and other visual content.

## Setup Instructions

### 1. Database Setup

Run the SQL script to create the necessary table and storage bucket:

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase_gallery.sql`
5. Click **Run** to execute

This will create:
- `gallery_images` table with proper indexes and RLS policies
- `gallery-images` storage bucket for image files

### 2. Access the Gallery Management Page

Once the database is set up, you can access the gallery management page at:

```
/admin/home/manage-gallery
```

Or navigate through the admin panel:
1. Go to `/admin`
2. Click on **Home**
3. Click on **Manage Gallery**

## Features

### 1. **Add Images**
- Click the **"Add Images"** button
- Select one or multiple image files
- Preview selected images before uploading
- Upload all images at once
- Images are automatically assigned a display order

### 2. **Delete Images**
- Each image card has a **"Delete"** button
- Confirmation dialog prevents accidental deletion
- Deletes both the database record and the storage file

### 3. **Rearrange Images (Drag & Drop)**
- Click and hold on any image card
- Drag it to the desired position
- Drop to reorder
- The display order is automatically updated in the database
- Changes are saved immediately

### 4. **Visual Feedback**
- Drag handle icon (⋮⋮) indicates draggable items
- Display order number shown on each card
- Success/error messages for all operations
- Loading states during uploads and data fetching

## Technical Details

### Database Schema

**Table: `gallery_images`**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `image_url` | TEXT | Public URL of the uploaded image |
| `alt_text` | TEXT | Alternative text for accessibility |
| `display_order` | INTEGER | Order in which images appear (1, 2, 3...) |
| `created_at` | TIMESTAMPTZ | Timestamp when image was added |
| `updated_at` | TIMESTAMPTZ | Timestamp when image was last modified |

### Storage Bucket

**Bucket: `gallery-images`**
- Public bucket (images are publicly accessible)
- Accepts only image files
- Files are named with timestamp and random string to prevent conflicts

### File Naming Convention

```
gallery_{timestamp}_{random}.{extension}
```

Example: `gallery_1706789123456_a7b3c9.jpg`

## Key Differences from Event Media

| Feature | Gallery Images | Event Media |
|---------|---------------|-------------|
| **Purpose** | General department photos | Event-specific media |
| **Location** | `/admin/home/manage-gallery` | `/admin/events/events` |
| **Table** | `gallery_images` | `events.media_urls` (JSON array) |
| **Bucket** | `gallery-images` | `event-media` |
| **Poster Images** | Not included | Stored separately in `event-posters` |
| **Reordering** | Drag & drop | Not available |

## Usage Tips

1. **Image Quality**: Upload high-resolution images for better display quality
2. **File Size**: Keep individual images under 5MB for faster loading
3. **Alt Text**: Currently auto-generated, but can be customized in the database
4. **Order**: Images with lower `display_order` values appear first
5. **Backup**: Consider backing up important images before deletion

## API Endpoints Used

The page interacts with Supabase using the following operations:

```javascript
// Fetch all gallery images
supabase.from('gallery_images').select('*').order('display_order')

// Insert new images
supabase.from('gallery_images').insert([...])

// Update display order
supabase.from('gallery_images').update({ display_order }).eq('id', id)

// Delete image
supabase.from('gallery_images').delete().eq('id', id)

// Upload to storage
supabase.storage.from('gallery-images').upload(fileName, file)

// Delete from storage
supabase.storage.from('gallery-images').remove([fileName])
```

## Troubleshooting

### Images not uploading
- Check that the `gallery-images` storage bucket exists
- Verify storage policies allow public uploads
- Check browser console for errors

### Images not displaying
- Verify the `gallery_images` table exists
- Check that RLS policies allow public read access
- Ensure image URLs are valid and accessible

### Drag & drop not working
- Make sure you're clicking and holding on the image card
- Try refreshing the page
- Check that `display_order` values are unique

## Future Enhancements

Potential improvements for future versions:
- [ ] Bulk delete functionality
- [ ] Image editing (crop, resize)
- [ ] Custom alt text editor
- [ ] Image categories/tags
- [ ] Search and filter
- [ ] Pagination for large galleries
- [ ] Image compression on upload
- [ ] Integration with home page gallery section

## Support

For issues or questions, check:
1. Browser console for error messages
2. Supabase dashboard logs
3. Network tab for failed requests
4. Database policies and permissions
