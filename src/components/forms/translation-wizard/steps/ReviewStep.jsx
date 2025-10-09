'use client';

import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

// @mui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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

// @project
import { useWizardConfig } from '../useWizardConfig';

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

export default function ReviewStep() {
  const {
    control,
    watch,
    formState: { errors }
  } = useFormContext();
  const data = watch();
  const wizardConfig = useWizardConfig(control);

  const optionFlags = useMemo(() => {
    return Object.entries(LABEL_MAP)
      .filter(([key]) => data?.options?.[key])
      .map(([key, label]) => label);
  }, [data]);

  return (
    <Grid container spacing={4}>
      <Grid size={12}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Review your request
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          Double-check these details before sending. Your Tasheel coordinator will confirm anything that looks unclear.
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <Card sx={{ borderRadius: 4, boxShadow: '0 22px 64px rgba(15,46,83,0.12)' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 }, display: 'grid', gap: 3.5 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                Contact details
              </Typography>
              <Stack spacing={0.75} sx={{ mt: 1.5 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {data?.contact?.fullName || '—'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data?.contact?.email || 'No email provided'}
                </Typography>
                {data?.contact?.phone && (
                  <Typography variant="body2" color="text.secondary">
                    {data.contact.phone}
                  </Typography>
                )}
                {data?.contact?.organisation && (
                  <Typography variant="body2">{data.contact.organisation}</Typography>
                )}
              </Stack>
              {data?.contact?.notes && (
                <Alert severity="info" variant="outlined" sx={{ mt: 2.5, borderRadius: 2 }}>
                  {data.contact.notes}
                </Alert>
              )}
            </Box>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {/* Service Name */}
            <Box>
              <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                Selected service
              </Typography>
              <Typography variant="body1" sx={{ mt: 1.5, fontWeight: 600 }}>
                {data?.meta?.serviceName || 'Not selected'}
              </Typography>
            </Box>

            {/* Project scope - Only for translation services */}
            {wizardConfig.needsLanguagePair && (
              <>
                <Divider sx={{ borderStyle: 'dashed' }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Project scope
                  </Typography>
                  <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                    <Typography variant="body2">
                      Languages: {data?.details?.sourceLanguage || '—'} → {data?.details?.targetLanguage || '—'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Purpose: {data?.details?.purpose || 'Not provided'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Word count: {data?.details?.wordCount ? `${data.details.wordCount} (approx.)` : 'Not provided'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Deadline: {data?.details?.deadline || 'Flexible'}
                    </Typography>
                  </Stack>
                </Box>
              </>
            )}

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Box>
              <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                Documents
              </Typography>

              {/* Service-specific documents */}
              {wizardConfig.documentRequirements?.length > 0 ? (
                <List
                  dense
                  disablePadding
                  sx={{ mt: 1.75, '& .MuiListItem-root': { borderRadius: 2, px: 0, '& + .MuiListItem-root': { mt: 1 } } }}
                >
                  {wizardConfig.documentRequirements.map((docType) => {
                    const uploadedFile = data?.serviceDocuments?.[docType.id];
                    return (
                      <ListItem
                        key={docType.id}
                        sx={{
                          border: '1px solid',
                          borderColor: uploadedFile ? 'success.main' : 'divider',
                          backgroundColor: uploadedFile ? 'success.lighter' : 'grey.50',
                          py: 1,
                          px: 1.5
                        }}
                      >
                        <ListItemText
                          primary={`${docType.label} ${uploadedFile ? '✓' : '(not uploaded)'}`}
                          secondary={uploadedFile ? `${(uploadedFile.size / 1024).toFixed(1)} KB` : 'Required'}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                /* Generic document upload */
                <>
                  <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Description: {data?.documents?.documentType || 'Not specified'}
                    </Typography>
                    {data?.documents?.link && (
                      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                        External link: {data.documents.link}
                      </Typography>
                    )}
                  </Stack>
                  <List
                    dense
                    disablePadding
                    sx={{ mt: 1.75, '& .MuiListItem-root': { borderRadius: 2, px: 0, '& + .MuiListItem-root': { mt: 1 } } }}
                  >
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
                </>
              )}
            </Box>

            {/* Selected options - Only show if service needs them */}
            {(wizardConfig.needsTranslationType || wizardConfig.needsTurnaround || wizardConfig.needsDeliveryMethod) && (
              <>
                <Divider sx={{ borderStyle: 'dashed' }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                    Selected options
                  </Typography>
                  <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                    {wizardConfig.needsTranslationType && (
                      <Typography variant="body2">
                        Translation type: {LABEL_MAP_TRANSLATION[data?.options?.translationType] || 'Not selected'}
                      </Typography>
                    )}
                    {wizardConfig.needsTurnaround && (
                      <Typography variant="body2">
                        Turnaround: {data?.options?.turnaround === 'rush' ? 'Rush (24 hours)' : 'Standard (2–3 business days)'}
                      </Typography>
                    )}
                    {wizardConfig.needsDeliveryMethod && (
                      <Typography variant="body2">
                        Delivery: {LABEL_MAP_DELIVERY[data?.options?.deliveryMethod] || 'Digital delivery (PDF)'}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Estimated total: Pending quote — shared after Tasheel review
                    </Typography>
                  </Stack>
                  <Stack spacing={0.75} sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontSize: '0.875rem' }}>
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
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Special instructions: {data.options.instructions}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Stack spacing={2.5} sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 20px 56px rgba(15,46,83,0.14)' }}>
            <CardContent sx={{ p: { xs: 3, md: 3.25 }, display: 'grid', gap: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                What happens next
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                • Tasheel reviews your files and options.<br />• You receive a confirmed quote and timeline.<br />• Approve online and the project kicks off immediately.
              </Typography>
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
            </CardContent>
          </Card>
          <Alert severity="info" sx={{ borderRadius: 3 }}>
            Have last-minute questions? Reply to the confirmation email or call the support line—your coordinator is ready to help.
          </Alert>
        </Stack>
      </Grid>
    </Grid>
  );
}
