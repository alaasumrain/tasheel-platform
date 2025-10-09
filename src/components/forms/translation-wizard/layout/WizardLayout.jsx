'use client';

import PropTypes from 'prop-types';
import { alpha, useTheme } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function WizardLayout({
  heading,
  subheading,
  status,
  stepper,
  summary,
  children,
  actions,
  isDevMode
}) {
  const theme = useTheme();

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Header Section */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="overline" color="primary" sx={{ letterSpacing: 1.2, fontWeight: 600 }}>
          Tasheel translation quote
        </Typography>
        <Typography variant="h4" sx={{ mt: 1, mb: 1.5, fontWeight: 700 }}>
          {heading}
        </Typography>
        {subheading && (
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            {subheading}
          </Typography>
        )}
      </Box>

      {/* Status Alert */}
      {status && (
        <Alert severity={status.type} onClose={status.onClose} sx={{ mb: 3 }}>
          {status.message}
        </Alert>
      )}

      {/* Two-Column Layout: Wizard + Sidebar */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 360px' },
          gap: { xs: 3, lg: 3 },
          alignItems: 'start'
        }}
      >
        {/* Left: Main Wizard Container */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden'
          }}
        >
          {/* Stepper Header */}
          <Box
            sx={{
              px: { xs: 3, md: 4 },
              py: { xs: 2.5, md: 3 },
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.02),
              borderBottom: '1px solid',
              borderColor: 'divider'
            }}
          >
            {stepper}
          </Box>

          {/* Content Area */}
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={3}>
              {/* Step Content */}
              <Box>{children}</Box>

              {/* Actions */}
              {actions}

              {/* Dev Mode Notice */}
              {isDevMode && (
                <Typography variant="caption" color="warning.main" sx={{ textAlign: 'center' }}>
                  ⚡ Dev mode: Validation skipped for faster testing
                </Typography>
              )}
            </Stack>
          </Box>
        </Paper>

        {/* Right: Sticky Summary Sidebar (Desktop only) */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'block' },
            position: 'sticky',
            top: 24,
            height: 'fit-content'
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.03),
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 4px 12px rgba(15,46,83,0.08)'
            }}
          >
            {summary}
          </Paper>
        </Box>
      </Box>

      {/* Mobile Summary - Show at bottom on small screens */}
      <Box sx={{ display: { xs: 'block', lg: 'none' }, mt: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.03),
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          {summary}
        </Paper>
      </Box>
    </Box>
  );
}

WizardLayout.propTypes = {
  heading: PropTypes.node.isRequired,
  subheading: PropTypes.node,
  status: PropTypes.shape({ type: PropTypes.string, message: PropTypes.string, onClose: PropTypes.func }),
  stepper: PropTypes.node.isRequired,
  summary: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  actions: PropTypes.node,
  isDevMode: PropTypes.bool
};
