'use client';

import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Controller } from 'react-hook-form';

// @mui
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import TasheelButton from '@/components/TasheelButton';
import SvgIcon from '@/components/SvgIcon';
import { outlinedInputSx } from '../../styles';

export default function ServiceSelectionSection({
  control,
  loading,
  serviceOptions,
  quickPickOptions,
  selectedService,
  onSelect,
  onClear
}) {
  const selectedValue = selectedService?.value || '';

  const groupedOptions = useMemo(() => serviceOptions, [serviceOptions]);

  return (
    <Card sx={{ borderRadius: { xs: 2, md: 4 }, boxShadow: { xs: '0 10px 34px rgba(15,46,83,0.08)', md: '0 22px 64px rgba(15,46,83,0.12)' }, overflow: 'hidden' }}>
      <CardContent
        sx={{
          p: { xs: 2.5, sm: 3, md: 4 },
          display: 'grid',
          gap: { xs: 3, md: 4 },
          gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' }
        }}
      >
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Box>
            <Typography variant="overline" sx={{ letterSpacing: 1, color: 'primary.main', fontSize: { xs: '0.6875rem', sm: '0.75rem' } }}>
              Step 1 • Choose service
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.75, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
              Service Selection
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25, fontSize: { xs: '0.875rem', sm: '0.875rem' } }}>
              We'll tailor pricing and deliverables based on the programme you choose. Pick a quick suggestion or search our full catalogue.
            </Typography>
          </Box>

          {loading ? (
            <Box
              sx={{
                display: 'grid',
                gap: 1.5,
                gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))', md: 'repeat(2, minmax(0, 1fr))' }
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rectangular" height={112} sx={{ borderRadius: 3 }} />
              ))}
            </Box>
          ) : !!quickPickOptions.length && (
            <Box
              sx={{
                display: 'grid',
                gap: 1.5,
                gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))', md: 'repeat(2, minmax(0, 1fr))' }
              }}
            >
              {quickPickOptions.map((option) => {
                const isActive = option.value === selectedValue;
                return (
                  <Box
                    key={`quick-${option.value}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelect(isActive ? null : option)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onSelect(isActive ? null : option);
                      }
                    }}
                    sx={{
                      display: 'grid',
                      gap: 0.75,
                      borderRadius: { xs: 2, sm: 3 },
                      border: '2px solid',
                      borderColor: isActive ? 'primary.main' : 'divider',
                      bgcolor: isActive ? 'primary.lighter' : 'common.white',
                      px: { xs: 1.5, sm: 2 },
                      py: { xs: 1.5, sm: 1.75 },
                      minHeight: { xs: 96, sm: 112 },
                      boxShadow: isActive ? '0 16px 40px rgba(15,46,83,0.16)' : '0 6px 24px rgba(15,46,83,0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: '0 18px 44px rgba(15,46,83,0.14)'
                      }
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: { xs: '0.8125rem', sm: '0.875rem' } }}>
                      {option.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: { xs: '0.6875rem', sm: '0.75rem' } }}>
                      {option.category}
                    </Typography>
                    {isActive && <Chip label="Selected" size="small" color="primary" sx={{ width: 'fit-content' }} />}
                  </Box>
                );
              })}
            </Box>
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }}>
            {selectedService && (
              <Typography variant="caption" color="text.secondary">
                Currently selected: <strong>{selectedService.label}</strong>
              </Typography>
            )}
            <TasheelButton
              variant="text"
              size="small"
              color="primary"
              startIcon={<SvgIcon name="tabler-rotate" size={16} />}
              sx={{ fontWeight: 600, px: 0, '&:hover': { backgroundColor: 'transparent' } }}
              onClick={onClear}
            >
              Clear selection
            </TasheelButton>
          </Stack>

          <Divider sx={{ display: { xs: 'block', md: 'none' } }} />
        </Box>

        <Box sx={{ display: 'grid', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Search the full catalogue
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Start typing keywords (e.g. “certified”, “marketing”, “interpreting”) or browse grouped results.
            </Typography>
          </Box>

          {loading ? (
            <Skeleton variant="rectangular" height={56} />
          ) : (
            <Controller
              name="meta.service"
              control={control}
              rules={{ required: 'Please select a service to continue' }}
              render={({ field, fieldState }) => (
                <Autocomplete
                  options={groupedOptions}
                  value={selectedService || null}
                  onChange={(_event, value) => {
                    if (!value) {
                      onClear();
                      field.onChange('');
                      return;
                    }
                    onSelect(value);
                    field.onChange(value.value);
                  }}
                  onBlur={field.onBlur}
                  groupBy={(option) => option.category}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  clearOnEscape
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Choose your translation service"
                      placeholder="Search for certified translation, localization, interpreting..."
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message || 'Search or scroll to view services by category'}
                      sx={outlinedInputSx}
                    />
                  )}
                  renderOption={(props, option) => {
                    const { key, ...rest } = props;
                    return (
                      <Box component="li" key={key} {...rest} sx={{ alignItems: 'flex-start', whiteSpace: 'normal', py: 1.25 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {option.label}
                      </Typography>
                      {option.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {option.description}
                        </Typography>
                      )}
                      <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, mt: 0.5 }}>
                        {option.price}
                      </Typography>
                      </Box>
                    );
                  }}
                  slotProps={{
                    paper: { sx: { maxHeight: 480 } },
                    clearIndicator: { sx: { color: 'primary.main' } }
                  }}
                  noOptionsText="No services match your search"
                  filterOptions={(options, state) => {
                    const query = state.inputValue.toLowerCase();
                    if (!query) return options;
                    return options.filter((option) => option.keywords?.toLowerCase().includes(query));
                  }}
                />
              )}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

ServiceSelectionSection.propTypes = {
  control: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  serviceOptions: PropTypes.array.isRequired,
  quickPickOptions: PropTypes.array,
  selectedService: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired
};
