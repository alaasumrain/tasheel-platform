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
              Digital Services Hub
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
  headLine: 'Faster permits, licenses, and civic services online.',
  captionLine:
    'Tasheel guides citizens, residents, and businesses through each step—submit once, track across ministries, and finish without the paperwork chase.',
  primaryBtn: { children: 'Start an Application', href: '/services' },
  secondaryBtn: { children: 'Track Application', href: '/track' },
  videoSrc: null,
  videoThumbnail: null,
  listData: [
    { icon: '🪪', title: 'Identity & Civil Records' },
    { icon: '🏢', title: 'Business & Trade Licenses' },
    { icon: '🛂', title: 'Residency & Visa Services' },
    { icon: '🚗', title: 'Vehicles & Transport' },
    { icon: '🏠', title: 'Property & Land Affairs' },
    { icon: '⚕️', title: 'Health & Safety Clearances' },
    { icon: '🔔', title: 'Real-time Status Updates' }
  ]
};
