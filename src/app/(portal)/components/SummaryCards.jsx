'use client';

import PropTypes from 'prop-types';

// @mui
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import SvgIcon from '@/components/SvgIcon';

export default function SummaryCards({ cards }) {
  return (
    <Grid container spacing={2.5}>
      {cards.map((card) => (
        <Grid key={card.title} size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              borderColor: 'divider',
              height: '100%',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box sx={{ maxWidth: '80%' }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.6 }}>
                  {card.title}
                </Typography>
              </Box>
              {card.icon && (
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    bgcolor: 'primary.lighter',
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <SvgIcon name={card.icon} size={18} />
                </Box>
              )}
            </Stack>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {card.value}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

SummaryCards.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      icon: PropTypes.string
    })
  ).isRequired
};
