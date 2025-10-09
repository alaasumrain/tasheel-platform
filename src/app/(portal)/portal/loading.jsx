import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export default function PortalLoading() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh'
      }}
    >
      <CircularProgress />
    </Box>
  );
}
