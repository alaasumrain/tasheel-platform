'use client';

// @mui
import { useTheme } from '@mui/material/styles';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// @project
import branding from '@/branding.json';

/***************************  LOGO - MAIN  ***************************/

export default function LogoMain() {
  const theme = useTheme();
  const logoMainPath = branding.logo.main;

  return logoMainPath ? (
    <CardMedia src={logoMainPath} component="img" alt="logo" sx={{ width: { xs: 112, lg: 140 } }} loading="lazy" />
  ) : (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 'bold', 
          color: theme.palette.primary.main,
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          letterSpacing: '-0.5px'
        }}
      >
        Tasheel
      </Typography>
      <Typography 
        variant="h6" 
        sx={{ 
          color: theme.palette.text.secondary,
          fontSize: { xs: '1rem', sm: '1.25rem' },
          ml: 1
        }}
      >
        | تسهيل
      </Typography>
    </Box>
  );
}