'use client';

import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// @mui
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';

const LABEL_MAP = {
  certification: 'Certification required',
  notarisation: 'Notarisation needed',
  physicalCopies: 'Physical copies required'
};

const LABEL_MAP_TRANSLATION = {
  certified: 'Certified translation',
  translation_only: 'Professional translation only',
  notarized: 'Notarized translation'
};

const LABEL_MAP_DELIVERY = {
  digital: 'Digital delivery (PDF)',
  digital_physical: 'Digital + physical copies'
};

const panelSx = {
  p: { xs: 2.5, md: 3 },
  borderRadius: 3,
  border: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'background.paper',
  boxShadow: '0 18px 40px rgba(15,46,83,0.08)',
  display: 'flex',
  flexDirection: 'column',
  gap: 1.25,
  minHeight: { md: 240 }
};

export default function ReviewStep() {
  const {
    control,
    watch,
    formState: { errors }
  } = useFormContext();
  const data = watch();

  const optionFlags = useMemo(() => {
    return Object.entries(LABEL_MAP)
      .filter(([key]) => data?.options?.[key])
      .map(([key, label]) => label);
  }, [data]);

  return (
    <Grid container spacing={3} rowSpacing={3.5}>
      <Grid xs={12} md={6}>
        <Box sx={panelSx}>
          <Typography variant="h6" gutterBottom>
            Contact details
          </Typography>
          <Typography variant="body2">{data?.contact?.fullName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {data?.contact?.email}
          </Typography>
          {data?.contact?.phone && (
            <Typography variant="body2" color="text.secondary">
              {data?.contact?.phone}
            </Typography>
          )}
          {data?.contact?.organisation && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Organisation: {data.contact.organisation}
            </Typography>
          )}
          {data?.contact?.notes && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Notes: {data.contact.notes}
            </Typography>
          )}
        </Box>
      </Grid>

      <Grid xs={12} md={6}>
        <Box sx={panelSx}>
          <Typography variant="h6" gutterBottom>
            Project details
          </Typography>
          <Typography variant="body2">
            {data?.details?.sourceLanguage} → {data?.details?.targetLanguage}
          </Typography>
          {data?.details?.wordCount && (
            <Typography variant="body2" color="text.secondary">
              Approx. {data.details.wordCount} words
            </Typography>
          )}
          {data?.details?.deadline && (
            <Typography variant="body2" color="text.secondary">
              Deadline: {data.details.deadline}
            </Typography>
          )}
          <Typography variant="body2" sx={{ mt: 1 }}>
            Purpose: {data?.details?.purpose}
          </Typography>
        </Box>
      </Grid>

      <Grid xs={12} md={6}>
        <Box sx={panelSx}>
          <Typography variant="h6" gutterBottom>
            Documents
          </Typography>
          <Typography variant="body2" gutterBottom>
            Type: {data?.documents?.documentType || '—'}
          </Typography>
          {data?.documents?.link && (
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ wordBreak: 'break-word' }}>
              Link: {data.documents.link}
            </Typography>
          )}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Uploaded files
          </Typography>
          <List dense disablePadding sx={{ '& .MuiListItem-root': { borderRadius: 2, px: 0, '& + .MuiListItem-root': { mt: 1 } } }}>
            {(data?.documents?.files || []).map((file, index) => (
              <ListItem
                key={`${file.name}-${index}`}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'grey.50',
                  py: 1,
                  px: 1.5
                }}
              >
                <ListItemText primary={file.name} secondary={`${(file.size / (1024 * 1024)).toFixed(2)} MB`} />
              </ListItem>
            ))}
            {(!data?.documents?.files || data.documents.files.length === 0) && (
              <Typography variant="body2" color="text.secondary">
                No files uploaded.
              </Typography>
            )}
          </List>
        </Box>
      </Grid>

      <Grid xs={12} md={6}>
        <Box sx={panelSx}>
          <Typography variant="h6" gutterBottom>
            Options
          </Typography>
          <Stack spacing={1.25}>
            <Typography variant="body2">
              Turnaround: {data?.options?.turnaround === 'rush' ? 'Rush (24 hours)' : 'Standard (2–3 business days)'}
            </Typography>
            <Typography variant="body2">
              Translation type: {LABEL_MAP_TRANSLATION[data?.options?.translationType] || 'Not selected'}
            </Typography>
            <Typography variant="body2">
              Delivery: {LABEL_MAP_DELIVERY[data?.options?.deliveryMethod] || 'Digital delivery'}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Estimated total: Pending quote — shared after Tasheel review
            </Typography>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Add-ons
          </Typography>
          {optionFlags.length ? (
            optionFlags.map((flag) => (
              <Typography key={flag} variant="body2">
                • {flag}
              </Typography>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No additional options selected.
            </Typography>
          )}
          {data?.options?.instructions && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Instructions: {data.options.instructions}
            </Typography>
          )}
          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              mt: 1,
              p: 2,
              border: '1px dashed',
              borderColor: errors?.consent ? 'error.light' : 'divider',
              borderRadius: 2,
              backgroundColor: 'background.default'
            }}
          >
            <Controller
              name="consent"
              control={control}
              rules={{ required: 'Please acknowledge that Tasheel may contact you about this request.' }}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox color="primary" {...field} checked={field.value} />}
                  label={
                    <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                      I understand Tasheel will review my documents and contact me with a formal quote and next steps.
                    </Typography>
                  }
                  sx={{ alignItems: 'flex-start', m: 0 }}
                />
              )}
            />
            {errors?.consent && <FormHelperText error sx={{ mt: 0.5 }}>{errors.consent.message}</FormHelperText>}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
