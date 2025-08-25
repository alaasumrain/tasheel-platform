// @mui
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

export const hero = {
  chip: {
    label: (
      <>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Tasheel | تسهيل
        </Typography>
        <Chip
          label={
            <Typography variant="caption" sx={{ color: 'primary.main' }}>
              Government Services
            </Typography>
          }
          sx={{ height: 24, bgcolor: 'primary.lighter', mr: -1, ml: 0.75, '& .MuiChip-label': { px: 1.25 } }}
          icon={
            <CardMedia
              component="img"
              image="/assets/images/shared/celebration.svg"
              sx={{ width: 16, height: 16 }}
              alt="celebration"
              loading="lazy"
            />
          }
        />
      </>
    )
  },
  headLine: 'Your Gateway to Government Services',
  captionLine: 'Simplify your government transactions with our comprehensive digital platform. Apply for permits, licenses, and visas all in one place.',
  primaryBtn: { children: 'Explore Services', href: '/services' },
  secondaryBtn: { children: 'Track Application', href: '/track' },
  videoSrc: null,
  videoThumbnail: null,
  listData: [
    { icon: '💼', title: 'Work Permits' },
    { icon: '🏢', title: 'Business Licenses' },
    { icon: '🏠', title: 'Residence Visas' },
    { icon: '🚗', title: 'Driving Licenses' },
    { icon: '📋', title: 'Document Services' },
    { icon: '💳', title: 'Online Payments' },
    { icon: '📊', title: 'Application Tracking' }
  ]
};