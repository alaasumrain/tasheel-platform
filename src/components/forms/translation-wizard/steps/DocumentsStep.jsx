'use client';

import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import { useFormContext } from 'react-hook-form';

import { DocumentDropzonePanel, DocumentGuidancePanel, useDocumentsLogic } from './components';

export default function DocumentsStep() {
  const methods = useFormContext();
  const {
    files,
    link,
    deferUpload,
    uploadWarning,
    handleFilesChange,
    handleRemove,
    handleDeferToggle
  } = useDocumentsLogic(methods);

  return (
    <Grid container spacing={4}>
      <Grid size={12}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Upload documents
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          Drag and drop files or paste a secure link. Scans and high-quality photos of identity documents, certificates, and forms are all welcome.
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <DocumentDropzonePanel
          files={files}
          link={link}
          deferUpload={deferUpload}
          errors={methods.formState.errors}
          uploadWarning={uploadWarning}
          onFilesChange={handleFilesChange}
          onRemoveFile={handleRemove}
          onFocusLink={() => methods.setFocus('documents.link')}
          clearErrors={methods.clearErrors}
          setValue={methods.setValue}
          watch={methods.watch}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <DocumentGuidancePanel
          register={methods.register}
          errors={methods.formState.errors}
          deferUpload={deferUpload}
          setValue={methods.setValue}
          onDeferToggle={handleDeferToggle}
        />
      </Grid>

      <Grid size={12}>
        <Alert
          severity="info"
          variant="outlined"
          sx={{ borderRadius: 2, borderColor: 'primary.light', backgroundColor: 'primary.lighter', color: 'primary.darker' }}
        >
          <Typography variant="body2">
            You can upload a maximum of 5 files now. Prefer sending a link later? Check “I’ll upload files later” and we’ll follow up with a secure
            request.
          </Typography>
        </Alert>
      </Grid>
    </Grid>
  );
}
