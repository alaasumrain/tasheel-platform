'use client';
// @mui
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

export const hero = {
  chip: {
    label: (
      <>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Tasheel | خدمات أسهل للجميع
        </Typography>
        <Chip
          label={
            <Typography variant="caption" sx={{ color: 'primary.main' }}>
              Services made simple
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
  headLine: 'Tasheel makes complex services effortless.',
  captionLine:
    'Start with professional translation handled by trusted linguists, digital tracking, and always-on support—the same simplicity we bring to every service we roll out.',
  primaryBtn: { children: 'Explore translation services', href: '/services' },
  secondaryBtn: { children: 'Talk to Tasheel', href: '/contact?intent=consult' },
  videoSrc: null,
  videoThumbnail: null,
  listData: [
    { icon: '📄', title: 'Certified translation made easy' },
    { icon: '🌍', title: 'Localization without the headache' },
    { icon: '🎧', title: 'Interpreting managed end to end' },
    { icon: '🎬', title: 'Media & AV support on demand' },
    { icon: '🕐', title: 'Status updates when you need them' },
    { icon: '🔒', title: 'Secure handling and confidentiality' },
    { icon: '🧭', title: 'More Tasheel services coming soon' }
  ]
};
