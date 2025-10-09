import PropTypes from 'prop-types';

// @mui
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import MainCard from './MainCard';
import SvgIcon from './SvgIcon';

export default function AnalyticEcommerce({ color = 'primary', title, count, percentage, isLoss, extra, icon }) {
  return (
    <MainCard contentSX={{ p: 2.25 }}>
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
          {percentage && (
            <Grid item>
              <Chip
                variant="combined"
                color={color}
                icon={
                  <SvgIcon
                    name={isLoss ? 'tabler-trending-down' : 'tabler-trending-up'}
                    size={16}
                    style={{ marginLeft: 0, marginRight: 0 }}
                  />
                }
                label={`${percentage}%`}
                sx={{ ml: 1.25, pl: 1 }}
                size="small"
              />
            </Grid>
          )}
        </Grid>
      </Stack>
      {(extra || icon) && (
        <Box sx={{ pt: 2.25 }}>
          {icon && (
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1,
                bgcolor: `${color}.lighter`,
                color: `${color}.main`,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: extra ? 1.5 : 0
              }}
            >
              <SvgIcon name={icon} size={20} />
            </Box>
          )}
          {extra && (
            <Typography variant="caption" color="text.secondary">
              {extra}
            </Typography>
          )}
        </Box>
      )}
    </MainCard>
  );
}

AnalyticEcommerce.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  percentage: PropTypes.number,
  isLoss: PropTypes.bool,
  extra: PropTypes.string,
  icon: PropTypes.string
};
