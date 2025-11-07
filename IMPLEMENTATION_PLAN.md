# Service Flow Implementation Plan - Immediate File Uploads

## Overview
Files should upload **immediately when selected**, not on form submission. This provides:
- ✅ Instant feedback to users
- ✅ Files saved even if form submission fails
- ✅ Better UX (like Google Drive, Dropbox)
- ✅ Progress indicators during upload

## Architecture

### Flow:
1. **Wizard Mounts** → Create draft application (`status: 'draft'`)
2. **User Selects File** → Upload immediately to Supabase Storage
3. **File Uploaded** → Create record in `application_attachments` table
4. **User Submits Form** → Update draft to `status: 'submitted'` (files already attached)

### Database Schema:
- `applications` table: Has `id` (UUID), `status` (can be 'draft')
- `application_attachments` table: Links files to `application_id`

## Implementation Steps

### 1. Create Draft Application on Mount
```typescript
useEffect(() => {
  const createDraft = async () => {
    const result = await createDraftApplication(service.slug);
    if (result.type === 'success') {
      setApplicationId(result.applicationId);
    }
  };
  createDraft();
}, [service.slug]);
```

### 2. Upload File Immediately
```typescript
const handleFileChange = async (fieldName: string, file: File | null) => {
  if (file && applicationId) {
    setUploadingFiles(prev => ({ ...prev, [fieldName]: true }));
    
    const result = await uploadFileImmediately(applicationId, fieldName, file);
    
    if (result.type === 'success') {
      setUploadedAttachments(prev => ({
        ...prev,
        [fieldName]: {
          id: result.attachmentId!,
          storagePath: result.storagePath!,
          fileName: file.name,
          fileSize: file.size,
        }
      }));
      toast.success(`${file.name} uploaded successfully`);
    } else {
      toast.error(result.message || 'Upload failed');
    }
    
    setUploadingFiles(prev => {
      const newState = { ...prev };
      delete newState[fieldName];
      return newState;
    });
  }
};
```

### 3. Track Upload State
```typescript
const [applicationId, setApplicationId] = useState<string | null>(null);
const [uploadedAttachments, setUploadedAttachments] = useState<Record<string, {
  id: string;
  storagePath: string;
  fileName: string;
  fileSize: number;
}>>({});
const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});
```

### 4. Pass applicationId to Submit
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const data = new FormData(formElement);
  data.set('applicationId', applicationId!); // Add draft application ID
  send(data);
};
```

### 5. Handle File Removal
```typescript
const handleRemoveFile = async (fieldName: string) => {
  const attachment = uploadedAttachments[fieldName];
  if (attachment) {
    await deleteUploadedFile(attachment.id, attachment.storagePath);
    // Remove from state
    setUploadedAttachments(prev => {
      const newState = { ...prev };
      delete newState[fieldName];
      return newState;
    });
  }
  // Also clear local file state
  setUploadedFiles(prev => {
    const newState = { ...prev };
    delete newState[fieldName];
    return newState;
  });
};
```

## UX Improvements

### File Upload States:
- **Selecting**: Show file picker
- **Uploading**: Show progress spinner + "Uploading..."
- **Uploaded**: Show checkmark + file name + size
- **Error**: Show error message + retry button

### Visual Feedback:
```typescript
{uploadingFiles[fieldName] ? (
  <CircularProgress size={20} />
) : uploadedAttachments[fieldName] ? (
  <IconCheck color="success" />
) : null}
```

## Required Documents Validation

Add to `validateStep(2)` (Review step):
```typescript
if (step === 2) {
  // Check required documents
  if (service.requiredDocuments && service.requiredDocuments.length > 0) {
    const uploadedFileNames = Object.values(uploadedAttachments).map(att => 
      att.fileName.toLowerCase()
    );
    
    const missingDocs = service.requiredDocuments.filter(doc => {
      const docKeywords = doc.toLowerCase().split(/\s+/);
      return !uploadedFileNames.some(fileName => 
        docKeywords.some(keyword => fileName.includes(keyword))
      );
    });

    if (missingDocs.length > 0) {
      newErrors.requiredDocuments = `Please upload: ${missingDocs.join(', ')}`;
    }
  }
}
```

## Admin File Display

Add to `OrderDetailClient.tsx`:
```typescript
// Fetch attachments
const { data: attachments } = await supabase
  .from('application_attachments')
  .select('*')
  .eq('application_id', order.id)
  .order('created_at', { ascending: false });

// Display section
{attachments && attachments.length > 0 && (
  <Card>
    <Box sx={{ p: 3 }}>
      <Typography variant="h6">Uploaded Documents ({attachments.length})</Typography>
      <Stack spacing={2} sx={{ mt: 2 }}>
        {attachments.map(att => (
          <Box key={att.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stack>
              <Typography>{att.file_name}</Typography>
              <Typography variant="caption">
                {(att.file_size / 1024).toFixed(2)} KB
              </Typography>
            </Stack>
            <Button
              onClick={async () => {
                const url = await getDownloadUrl('CUSTOMER_UPLOADS', att.storage_path);
                if (url) window.open(url, '_blank');
              }}
            >
              Download
            </Button>
          </Box>
        ))}
      </Stack>
    </Box>
  </Card>
)}
```

## Error Handling

### Draft Creation Failure:
- Show error toast
- Allow form to continue (fallback to old flow)
- Log error for debugging

### File Upload Failure:
- Show error toast with retry option
- Keep file in state for retry
- Don't block form submission

### Network Issues:
- Queue uploads for retry
- Show offline indicator
- Save to localStorage for later sync

## Testing Checklist

- [ ] Draft application created on mount
- [ ] File uploads immediately on selection
- [ ] Upload progress shown during upload
- [ ] Success feedback after upload
- [ ] Error handling for failed uploads
- [ ] File removal deletes from storage
- [ ] Form submission uses draft application
- [ ] All attachments linked to application
- [ ] Admin can see uploaded files
- [ ] Admin can download files
- [ ] Required documents validation works
- [ ] Service-specific fields saved correctly
