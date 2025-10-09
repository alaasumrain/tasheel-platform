'use client';

import { useCallback } from 'react';
import PropTypes from 'prop-types';

// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import SvgIcon from '@/components/SvgIcon';

/**
 * Component for uploading service-specific documents
 * Shows individual upload fields for each required document
 */
export default function ServiceDocumentUploader({ documentRequirements, setValue, watch, errors }) {
  const serviceDocuments = watch('serviceDocuments') || {};

  const handleFileSelect = useCallback(
    (documentId, event) => {
      const file = event.target.files?.[0];
      if (file) {
        setValue(`serviceDocuments.${documentId}`, file, { shouldValidate: true, shouldDirty: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(
    (documentId) => {
      setValue(`serviceDocuments.${documentId}`, null, { shouldValidate: true, shouldDirty: true });
    },
    [setValue]
  );

  return (
    <Grid container spacing={3}>
      {documentRequirements.map((docType) => {
        const uploadedFile = serviceDocuments[docType.id];
        const hasError = errors?.serviceDocuments?.[docType.id];

        return (
          <Grid key={docType.id} size={12}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 2,
                borderColor: hasError ? 'error.main' : uploadedFile ? 'success.main' : 'divider',
                borderWidth: hasError || uploadedFile ? 2 : 1,
                bgcolor: uploadedFile ? alpha('#4caf50', 0.04) : 'background.paper'
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={2}>
                  {/* Document Info */}
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {docType.label}
                      </Typography>
                      {docType.required && (
                        <Typography variant="caption" color="error.main" sx={{ fontWeight: 600 }}>
                          *
                        </Typography>
                      )}
                      {uploadedFile && (
                        <SvgIcon name="tabler-circle-check" size={18} color="success.main" />
                      )}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {docType.description}
                    </Typography>
                  </Box>

                  {/* Upload Section */}
                  {!uploadedFile ? (
                    <Box>
                      <input
                        type="file"
                        id={`file-input-${docType.id}`}
                        accept={docType.accept}
                        style={{ display: 'none' }}
                        onChange={(e) => handleFileSelect(docType.id, e)}
                      />
                      <label htmlFor={`file-input-${docType.id}`}>
                        <Button
                          component="span"
                          variant="outlined"
                          startIcon={<SvgIcon name="tabler-upload" size={18} />}
                          size="small"
                        >
                          Choose file
                        </Button>
                      </label>
                      {hasError && (
                        <Typography variant="caption" color="error.main" sx={{ display: 'block', mt: 1 }}>
                          {hasError.message}
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{
                        p: 1.5,
                        bgcolor: alpha('#4caf50', 0.08),
                        borderRadius: 1.5
                      }}
                    >
                      <SvgIcon name="tabler-file" size={20} color="success.main" />
                      <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>
                        {uploadedFile.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveFile(docType.id)}
                        sx={{ ml: 1 }}
                      >
                        <SvgIcon name="tabler-x" size={16} />
                      </IconButton>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

ServiceDocumentUploader.propTypes = {
  documentRequirements: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      required: PropTypes.bool.isRequired,
      accept: PropTypes.string.isRequired
    })
  ).isRequired,
  setValue: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
  errors: PropTypes.object
};
