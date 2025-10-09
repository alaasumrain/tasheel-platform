'use client';

import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { outlinedInputSx } from '../../styles';

export default function DocumentGuidancePanel({
  register,
  errors,
  deferUpload,
  setValue,
  onDeferToggle
}) {
  return (
    <Stack spacing={2.5} sx={{ position: 'sticky', top: 88 }}>
      <Box
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          px: { xs: 2.5, md: 3 },
          py: { xs: 2.5, md: 3 },
          boxShadow: '0 18px 48px rgba(15,46,83,0.10)',
          backgroundColor: 'background.paper'
        }}
      >
        <Stack spacing={2.5}>
          <TextField
            label="Document description"
            placeholder="e.g. Birth certificate, employment contract"
            fullWidth
            {...register('documents.documentType')}
            helperText="Optional — helps our team identify deliverables"
            sx={outlinedInputSx}
            disabled={deferUpload}
          />
          <TextField
            label="Secure link"
            placeholder="Paste Google Drive, Dropbox, or OneDrive link"
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
            helperText={errors?.documents?.link?.message || 'We’ll download files from this link if you prefer'}
            sx={outlinedInputSx}
            disabled={deferUpload}
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={Boolean(deferUpload)}
                onChange={(event) => onDeferToggle(event.target.checked)}
              />
            }
            label={
              <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                I’ll upload files later. Tasheel can collect them after scoping the project.
              </Typography>
            }
            sx={{ alignItems: 'flex-start', m: 0 }}
          />
          <Typography variant="caption" color="text.secondary">
            We’ll send a secure upload link once you approve the quote.
          </Typography>
        </Stack>
      </Box>

      <Box
        sx={{
          borderRadius: 3,
          background: (theme) => alpha(theme.palette.primary.light, 0.18),
          px: { xs: 2.5, md: 3 },
          py: { xs: 2.5, md: 3 },
          border: '1px solid',
          borderColor: 'primary.light'
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          Helpful guidelines
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          • Prefer flattened PDFs or high-resolution images.<br />• Combine related pages into a single file when possible.<br />• If your documents contain sensitive information, mention any handling requirements in the notes.
        </Typography>
      </Box>
    </Stack>
  );
}

DocumentGuidancePanel.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  deferUpload: PropTypes.bool,
  setValue: PropTypes.func.isRequired,
  onDeferToggle: PropTypes.func.isRequired
};
