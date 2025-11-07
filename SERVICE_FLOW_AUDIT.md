# Service Flow End-to-End Audit

**Date:** January 2025  
**Status:** 🔴 **CRITICAL ISSUES FOUND**

## Overview

This audit examines the complete service request flow from customer submission through admin processing to customer tracking. Several critical gaps were identified that prevent the system from functioning properly.

---

## 🔴 CRITICAL ISSUES

### 1. **File Uploads Are NOT Being Saved** ⚠️ **BLOCKER**

**Location:** `src/app/actions/submit-quote-request.ts`

**Problem:**
- The `ServiceQuoteWizard` component collects files and adds them to `FormData`
- The server action receives `FormData` but **only extracts text fields**
- **Files are completely ignored** - never uploaded to Supabase Storage
- No file records are created in the `files` table

**Current Code:**
```typescript
// submit-quote-request.ts - Only extracts text fields
const name = formData.get('name') as string;
const email = formData.get('email') as string;
// ... other text fields
// ❌ NO FILE HANDLING AT ALL
```

**Impact:**
- Customers upload documents but they're lost
- Admins cannot see customer documents
- Service processing cannot proceed without documents
- **This breaks the entire workflow**

**Fix Required:**
1. Extract files from FormData
2. Upload each file to Supabase Storage (`customer-uploads` bucket)
3. Create file records in `files` table with `application_id`
4. Store file metadata in `application.payload.files` for reference

---

### 2. **Service-Specific Fields Not Saved** ⚠️ **HIGH PRIORITY**

**Location:** `src/app/actions/submit-quote-request.ts`

**Problem:**
- Service-specific fields (e.g., `current_license_number`, `country_of_issue`, `page_count`) are collected in the form
- Only `urgency`, `details`, and `additional_notes` are saved to `payload`
- **All service-specific data is lost**

**Current Code:**
```typescript
payload: {
  urgency,
  details,
  additional_notes: additionalNotes,
  // ❌ Missing: All service-specific fields from service-form-fields.ts
}
```

**Impact:**
- Admins don't see critical service requirements
- Cannot process orders without manual follow-up
- Poor customer experience

**Fix Required:**
- Extract all form fields from FormData
- Save service-specific fields to `payload` object
- Include field names and values for admin review

---

### 3. **No Required Documents Validation** ⚠️ **HIGH PRIORITY**

**Location:** `src/components/forms/service-quote-wizard.tsx`

**Problem:**
- Service detail page shows `requiredDocuments` array
- Form shows `RequiredDocumentsChecklist` component
- **No validation ensures required documents are uploaded before submission**

**Current Behavior:**
- Users can submit without uploading required documents
- Checklist is informational only
- No blocking validation

**Impact:**
- Incomplete orders submitted
- Admin must request documents manually
- Delays processing

**Fix Required:**
- Add validation in `validateStep(2)` (Review step)
- Check uploaded files against `service.requiredDocuments`
- Block submission if required documents missing
- Show clear error messages

---

### 4. **Admin Cannot View Uploaded Files** ⚠️ **MEDIUM PRIORITY**

**Location:** `src/components/admin/OrderDetailClient.tsx` (if exists)

**Problem:**
- Files may be uploaded (once fixed) but admin detail page doesn't show them
- Need to query `files` table and display with download links

**Fix Required:**
- Query `files` table filtered by `application_id`
- Display file list with names, sizes, upload dates
- Generate signed URLs for file downloads
- Show file previews where possible

---

## ✅ WHAT'S WORKING

### 1. **Service Detail Page**
- ✅ Displays service information correctly
- ✅ Shows required documents list
- ✅ Links to quote request form

### 2. **Quote Request Wizard UI**
- ✅ 3-step wizard flow works well
- ✅ Service-specific fields render correctly
- ✅ File upload UI is functional (client-side)
- ✅ Form validation for contact info works
- ✅ Auto-save to localStorage works

### 3. **Order Creation**
- ✅ Application record created in database
- ✅ Order number generated correctly
- ✅ Status set to 'submitted'
- ✅ Event logged in `application_events`

### 4. **Email Notifications**
- ✅ Customer confirmation email sent
- ✅ Admin alert email sent
- ✅ Email templates use React Email

### 5. **Customer Tracking**
- ✅ Track page works
- ✅ Order lookup by order number
- ✅ Status timeline displays correctly
- ✅ Order details shown

### 6. **Admin Dashboard**
- ✅ Orders table displays applications
- ✅ Order detail page exists
- ✅ Status management works

---

## 📋 DETAILED FLOW ANALYSIS

### Current Flow (Broken)

```
1. Customer visits /services/[slug]
   ✅ Service detail page loads
   ✅ Shows required documents

2. Customer clicks "Request Quote"
   ✅ Redirects to /services/[slug]/quote
   ✅ Wizard form loads

3. Customer fills Step 1: Contact Info
   ✅ Name, email, phone validated
   ✅ Data saved to localStorage

4. Customer fills Step 2: Service Requirements
   ✅ Service-specific fields render
   ✅ Files uploaded (client-side only)
   ✅ Data saved to localStorage

5. Customer reviews Step 3
   ✅ Shows summary
   ✅ Shows uploaded files (preview only)
   ✅ Required documents checklist shown

6. Customer submits form
   ✅ FormData created with text fields
   ✅ Files added to FormData
   ❌ Server receives FormData
   ❌ Server extracts ONLY text fields
   ❌ Files are IGNORED
   ❌ Files never uploaded to storage
   ❌ File records never created

7. Application created
   ✅ Record in `applications` table
   ✅ Order number generated
   ❌ Payload missing service-specific fields
   ❌ No file references

8. Emails sent
   ✅ Customer confirmation
   ✅ Admin alert

9. Admin views order
   ✅ Order appears in dashboard
   ❌ Cannot see uploaded files
   ❌ Missing service-specific data
   ❌ Must contact customer for documents

10. Customer tracks order
    ✅ Order found
    ✅ Status displayed
    ❌ Cannot see uploaded files
```

---

## 🔧 REQUIRED FIXES

### Fix 1: Handle File Uploads in Server Action

**File:** `src/app/actions/submit-quote-request.ts`

```typescript
// Add file upload handling
import { uploadFile } from '@/lib/storage';

export async function submitQuoteRequest(formData: FormData) {
  // ... existing validation ...

  // Create application first to get ID
  const { data: application, error: dbError } = await supabase
    .from('applications')
    .insert({...})
    .select()
    .single();

  if (dbError || !application) {
    return { type: 'error', message: 'Failed to create order' };
  }

  // Upload files
  const uploadedFiles: Array<{fieldName: string, path: string, url: string}> = [];
  
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      try {
        const { path, url, error: uploadError } = await uploadFile(
          'CUSTOMER_UPLOADS',
          application.id,
          value
        );

        if (uploadError || !path) {
          console.error(`Failed to upload ${key}:`, uploadError);
          continue; // Continue with other files
        }

        // Create file record
        await supabase.from('files').insert({
          application_id: application.id,
          filename: value.name,
          file_path: path,
          file_size: value.size,
          file_type: value.type,
          is_customer_upload: true,
        });

        uploadedFiles.push({ fieldName: key, path, url });
      } catch (error) {
        console.error(`Error uploading file ${key}:`, error);
      }
    }
  }

  // Update payload with file references
  const updatedPayload = {
    ...payload,
    uploaded_files: uploadedFiles.map(f => ({
      field_name: f.fieldName,
      filename: formData.get(f.fieldName + '_name') as string,
      path: f.path,
    })),
  };

  // Update application with complete payload
  await supabase
    .from('applications')
    .update({ payload: updatedPayload })
    .eq('id', application.id);
}
```

### Fix 2: Save Service-Specific Fields

**File:** `src/app/actions/submit-quote-request.ts`

```typescript
// Extract all form fields
const formFields: Record<string, string> = {};
for (const [key, value] of formData.entries()) {
  if (!(value instanceof File)) {
    formFields[key] = value as string;
  }
}

// Get service-specific fields
const { getServiceFields } = await import('@/lib/service-form-fields');
const serviceFields = getServiceFields(serviceSlug);
const serviceSpecificData: Record<string, string> = {};

serviceFields.forEach(field => {
  if (formFields[field.name]) {
    serviceSpecificData[field.name] = formFields[field.name];
  }
});

// Include in payload
payload: {
  urgency,
  details,
  additional_notes: additionalNotes,
  service_specific: serviceSpecificData, // ✅ Add this
}
```

### Fix 3: Validate Required Documents

**File:** `src/components/forms/service-quote-wizard.tsx`

```typescript
const validateStep = (step: number): boolean => {
  // ... existing validation ...

  if (step === 2) {
    // Check required documents
    if (service.requiredDocuments && service.requiredDocuments.length > 0) {
      const uploadedFileNames = Object.values(uploadedFiles).map(f => f.name.toLowerCase());
      const missingDocs = service.requiredDocuments.filter(doc => {
        // Simple check: see if any uploaded file name contains keywords from required doc
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

  // ... rest of validation
};
```

### Fix 4: Display Files in Admin Order Detail

**File:** `src/components/admin/OrderDetailClient.tsx` (or create if missing)

```typescript
// Query files for this application
const { data: files } = await supabase
  .from('files')
  .select('*')
  .eq('application_id', order.id)
  .order('created_at', { ascending: false });

// Display files section
{files && files.length > 0 && (
  <Box>
    <Typography variant="h6">Uploaded Documents</Typography>
    <Stack spacing={2}>
      {files.map(file => (
        <Card key={file.id}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack>
              <Typography>{file.filename}</Typography>
              <Typography variant="caption">
                {(file.file_size / 1024).toFixed(2)} KB
              </Typography>
            </Stack>
            <Button
              onClick={async () => {
                const url = await getDownloadUrl('CUSTOMER_UPLOADS', file.file_path);
                if (url) window.open(url, '_blank');
              }}
            >
              Download
            </Button>
          </Stack>
        </Card>
      ))}
    </Stack>
  </Box>
)}
```

---

## 🎯 PRIORITY ORDER

1. **🔴 CRITICAL:** Fix file uploads (blocks all service processing)
2. **🟠 HIGH:** Save service-specific fields (needed for admin processing)
3. **🟠 HIGH:** Validate required documents (prevents incomplete orders)
4. **🟡 MEDIUM:** Display files in admin panel (needed for order processing)

---

## 📊 TESTING CHECKLIST

After fixes, test:

- [ ] Upload single file → Verify in Supabase Storage
- [ ] Upload multiple files → All saved correctly
- [ ] Submit with required documents → Validation passes
- [ ] Submit without required documents → Validation blocks
- [ ] Service-specific fields → Saved to payload
- [ ] Admin views order → Sees all files
- [ ] Admin downloads file → Signed URL works
- [ ] Customer tracks order → Can see file count (optional)

---

## 📝 ADDITIONAL RECOMMENDATIONS

1. **File Size Limits:** Currently 10MB max - consider increasing for large documents
2. **File Type Validation:** Add server-side validation for allowed file types
3. **File Preview:** Add image/document preview in admin panel
4. **Bulk Download:** Allow admins to download all files as ZIP
5. **File Replacement:** Allow customers to replace uploaded files before processing starts
6. **Progress Indicators:** Show upload progress for large files
7. **Error Handling:** Better error messages for upload failures

---

## 🚀 ESTIMATED EFFORT

- **Fix 1 (File Uploads):** 2-3 hours
- **Fix 2 (Service Fields):** 1 hour
- **Fix 3 (Validation):** 1-2 hours
- **Fix 4 (Admin Display):** 1-2 hours

**Total:** 5-8 hours

---

**Status:** Ready for implementation after approval.

