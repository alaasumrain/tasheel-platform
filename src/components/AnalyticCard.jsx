import PropTypes from 'prop-types';

// @mui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import MainCard from './MainCard';
import SvgIcon from './SvgIcon';

export default function AnalyticCard({ color = 'primary', title, count, icon }) {
  return (
    <MainCard contentSX={{ p: 2 }}>
      <Stack spacing={0.5}>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
        <Grid container alignItems="center">
          <Grid item>
            <Typography variant="h4" color="inherit">
              {count}
            </Typography>
          </Grid>
        </Grid>
      </Stack>
      {icon && (
        <Box
          sx={{
            pt: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1,
              bgcolor: `${color}.lighter`,
              color: `${color}.main`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SvgIcon name={icon} size={20} />
          </Box>
        </Box>
      )}
    </MainCard>
  );
}

AnalyticCard.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.string
};
