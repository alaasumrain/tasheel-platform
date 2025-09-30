'use client';

import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TasheelButton from '@/components/TasheelButton';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// @mui icons
import SvgIcon from '@/components/SvgIcon';
import { outlinedInputSx } from '../styles';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/jpeg',
  'image/png'
];

export default function DocumentsStep() {
  const [uploadWarning, setUploadWarning] = useState('');

  const {
    register,
    setValue,
    setFocus,
    setError,
    watch,
    formState: { errors },
    clearErrors
  } = useFormContext();

  const files = watch('documents.files') || [];
  const link = watch('documents.link');

  useEffect(() => {
    register('documents.files', {
      validate: (value) => {
        const hasFiles = value && value.length > 0;
        const hasLink = Boolean(link);
        return hasFiles || hasLink || 'Upload at least one file or share a link';
      }
    });
  }, [register, link]);

  useEffect(() => {
    if (link) {
      clearErrors('documents.files');
      setUploadWarning('');
    }
  }, [link, clearErrors]);

  const handleFileChange = useCallback(
    (event) => {
      const incomingFiles = Array.from(event.target.files || []);
      if (!incomingFiles.length) return;

      let rejected = 0;

      const filtered = incomingFiles.filter((file) => {
        const withinSize = file.size <= 20 * 1024 * 1024; // 20MB
        const acceptedType = ACCEPTED_TYPES.includes(file.type);
        const acceptedName = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|jpeg|jpg|png)$/i.test(file.name);
        const ok = withinSize && (acceptedType || acceptedName);
        if (!ok) rejected += 1;
        return ok;
      });

      const nextFiles = [...files, ...filtered].slice(0, 5);
      setValue('documents.files', nextFiles, { shouldDirty: true, shouldValidate: true });
      if (nextFiles.length > 0) {
        clearErrors('documents.files');
        setUploadWarning(rejected > 0 ? 'Some files were skipped because they exceeded 20MB or used unsupported formats.' : '');
        if (!watch('documents.documentType')) {
          const firstName = nextFiles[0]?.name?.split('.')?.[0] || '';
          if (firstName) {
            setValue('documents.documentType', firstName, { shouldDirty: false });
          }
        }
      }

      if (rejected > 0 && filtered.length === 0 && nextFiles.length === 0 && !link) {
        setError('documents.files', {
          type: 'manual',
          message:
            rejected === incomingFiles.length
              ? 'Files must be PDF, Office, or image formats under 20MB.'
              : 'Some files were skipped because they exceeded 20MB or used unsupported formats.'
        });
        setUploadWarning('');
      }
      event.target.value = '';
    },
    [files, setValue, clearErrors, setError, watch, link]
  );

  const handleRemove = useCallback(
    (index) => {
      const next = files.filter((_, i) => i !== index);
      setValue('documents.files', next, { shouldDirty: true, shouldValidate: true });
    },
    [files, setValue]
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Upload documents
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Drag and drop files or paste a secure sharing link. We accept scans and photos of identity documents, certificates, and forms.
        </Typography>
      </Grid>
      <Grid xs={12} md={6}>
        <TextField
          label="Document description"
          placeholder="e.g. Birth certificate, employment contract (optional)"
          fullWidth
          {...register('documents.documentType')}
          sx={outlinedInputSx}
        />
      </Grid>
      <Grid xs={12} md={6}>
        <TextField
          label="Shared link (optional)"
          placeholder="Google Drive, Dropbox, OneDrive link"
          fullWidth
          {...register('documents.link', {
            validate: (value) => {
              if (!value) return true;
              return /^(https?:\/\/)[\w.-]+(\.[\w.-]+)+[\w\-\._~:\/?#[\]@!$&'()*+,;=.]+$/.test(value)
                ? true
                : 'Enter a valid URL starting with https://';
            }
          })}
          error={Boolean(errors?.documents?.link)}
          helperText={errors?.documents?.link?.message}
          sx={outlinedInputSx}
        />
      </Grid>
      <Grid xs={12}>
        <Stack spacing={2.5}>
          <Box
            component="label"
            htmlFor="translation-dropzone"
            sx={{
              p: { xs: 3, md: 3.5 },
              borderRadius: 3,
              border: '1px dashed',
              borderColor: errors?.documents?.files ? 'error.light' : 'divider',
              background: (theme) => alpha(theme.palette.primary.light, 0.12),
              cursor: 'pointer',
              transition: 'all 0.28s ease',
              display: 'block',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: '0 18px 44px rgba(15,46,83,0.12)',
                background: (theme) => alpha(theme.palette.primary.light, 0.18)
              }
            }}
          >
            <input id="translation-dropzone" type="file" hidden multiple accept={ACCEPTED_TYPES.join(',')} onChange={handleFileChange} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: 'common.white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 14px 36px rgba(15,46,83,0.12)'
                }}
              >
                <SvgIcon name="tabler-upload" size={26} color="primary.main" />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Drag & drop files or click to browse
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  Up to 5 files, 20MB each. Accepted formats: PDF, DOC(X), XLS(X), PPT(X), JPG, PNG.
                </Typography>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  sx={{
                    mt: 2,
                    width: '100%',
                    alignItems: { sm: 'center' },
                    '& > *': { width: { xs: '100%', sm: 'auto' } }
                  }}
                >
                  <TasheelButton component="span" variant="contained" fullWidth sx={{ borderRadius: 999 }}>
                    Choose files
                  </TasheelButton>
                  <TasheelButton
                    component="span"
                    variant="text"
                    color="primary"
                    sx={{ fontWeight: 600, justifyContent: { xs: 'center', sm: 'flex-start' } }}
                    onClick={(event) => {
                      event.preventDefault();
                      setFocus('documents.link');
                    }}
                  >
                    Use a secure link instead
                  </TasheelButton>
                </Stack>
              </Box>
            </Stack>
            {errors?.documents?.files && (
              <Typography variant="caption" color="error.main" sx={{ display: 'block', mt: 2 }}>
                {errors.documents.files.message}
              </Typography>
            )}
            {!errors?.documents?.files && uploadWarning && (
              <Typography variant="caption" color="warning.main" sx={{ display: 'block', mt: 2 }}>
                {uploadWarning}
              </Typography>
            )}
          </Box>

          <List dense disablePadding sx={{ mt: 0.5 }}>
            {files.map((file, index) => (
              <ListItem
                key={`${file.name}-${index}`}
                sx={{
                  px: 1.5,
                  py: 1.25,
                  '& + &': { mt: 1 },
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  backgroundColor: 'background.paper',
                  boxShadow: '0 8px 20px rgba(15,46,83,0.08)',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: { xs: 1, sm: 0 }
                }}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleRemove(index)} aria-label="remove file">
                    <SvgIcon name="tabler-x" size={20} />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <SvgIcon name="tabler-file-description" size={24} />
                </ListItemAvatar>
                <ListItemText
                  primary={file.name}
                  secondary={`${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                  primaryTypographyProps={{ sx: { wordBreak: 'break-word' } }}
                  secondaryTypographyProps={{ sx: { color: 'text.secondary' } }}
                />
              </ListItem>
            ))}
            {!files.length && (
              <Typography variant="body2" color="text.secondary">
                No files uploaded yet.
              </Typography>
            )}
          </List>
          <Typography variant="caption" color="text.secondary">
            Tip: Drag and drop files anywhere in this area or paste a shared link if your documents are already in the cloud.
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
}
