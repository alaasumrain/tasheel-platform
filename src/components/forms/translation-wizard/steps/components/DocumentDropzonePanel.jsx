'use client';

import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Stack from '@mui/material/Stack';
import TasheelButton from '@/components/TasheelButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import SvgIcon from '@/components/SvgIcon';

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

export default function DocumentDropzonePanel({
  files,
  link,
  deferUpload,
  errors,
  uploadWarning,
  onFilesChange,
  onRemoveFile,
  onFocusLink,
  clearErrors,
  setValue,
  watch
}) {
  const handleFileChange = (event) => {
    if (deferUpload) return;
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

    onFilesChange(filtered, rejected);
    event.target.value = '';
  };

  return (
    <Stack spacing={3}>
      <Box
        component="label"
        htmlFor="translation-dropzone"
        sx={{
          p: { xs: 3.25, md: 3.75 },
          borderRadius: 3,
          border: '1px dashed',
          borderColor: errors?.documents?.files ? 'error.light' : 'divider',
          background: (theme) => alpha(theme.palette.primary.light, 0.12),
          cursor: 'pointer',
          transition: 'all 0.28s ease',
          display: 'block',
          minHeight: { xs: 220, md: 240 },
          pointerEvents: deferUpload ? 'none' : 'auto',
          opacity: deferUpload ? 0.4 : 1,
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: '0 18px 44px rgba(15,46,83,0.12)',
            background: (theme) => alpha(theme.palette.primary.light, 0.18)
          }
        }}
      >
        <input
          id="translation-dropzone"
          type="file"
          hidden
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFileChange}
          disabled={deferUpload}
        />
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
                  onFocusLink();
                }}
              >
                Use a secure link instead
              </TasheelButton>
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Collapse in={Boolean(errors?.documents?.files)} unmountOnExit>
        <Typography variant="caption" color="error.main" sx={{ display: 'block', mt: 2 }}>
          {errors?.documents?.files?.message}
        </Typography>
      </Collapse>
      <Collapse in={!errors?.documents?.files && Boolean(uploadWarning)} unmountOnExit>
        <Typography variant="caption" color="warning.main" sx={{ display: 'block', mt: 2 }}>
          {uploadWarning}
        </Typography>
      </Collapse>

      <List
        dense
        disablePadding
        sx={{
          mt: 1,
          maxHeight: 260,
          overflowY: 'auto',
          pr: 0.5,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.3),
            borderRadius: 999
          }
        }}
      >
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
              <IconButton edge="end" onClick={() => onRemoveFile(index)} aria-label="remove file">
                <SvgIcon name="tabler-x" size={20} />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <SvgIcon name="tabler-file-description" size={24} />
            </ListItemAvatar>
            <Box sx={{ minWidth: 0 }}>
              <Tooltip title={file.name} placement="top" enterDelay={400}>
                <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                  {file.name}
                </Typography>
              </Tooltip>
              <Typography variant="caption" color="text.secondary">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </Typography>
            </Box>
          </ListItem>
        ))}
        {!files.length && (
          <Typography variant="body2" color="text.secondary">
            No files uploaded yet.
          </Typography>
        )}
      </List>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.75 }}>
        Tip: You can also paste files straight from your clipboard or drop a folder—if you need to send more than 5 files, use the secure link option on the right.
      </Typography>
    </Stack>
  );
}

DocumentDropzonePanel.propTypes = {
  files: PropTypes.array.isRequired,
  link: PropTypes.string,
  deferUpload: PropTypes.bool,
  errors: PropTypes.object,
  uploadWarning: PropTypes.string,
  onFilesChange: PropTypes.func.isRequired,
  onRemoveFile: PropTypes.func.isRequired,
  onFocusLink: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired
};
