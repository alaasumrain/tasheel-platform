'use client';
// @mui
import { alpha } from '@mui/material/styles';
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
          sx={(theme) => ({
            height: 28,
            borderRadius: 999,
            bgcolor: alpha(theme.palette.primary.main, 0.16),
            border: '1px solid',
            borderColor: alpha(theme.palette.primary.main, 0.18),
            mr: -1,
            ml: 0.75,
            '& .MuiChip-label': { px: 1.5, fontWeight: 600 }
          })}
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
  primaryBtn: {
    children: 'Explore translation services',
    href: '/services',
    sx: {
      background: 'linear-gradient(135deg, rgba(15,46,83,1) 0%, rgba(24,73,133,1) 100%)',
      boxShadow: '0 28px 68px rgba(15,46,83,0.28)',
      '&:hover': {
        background: 'linear-gradient(135deg, rgba(21,60,105,1) 0%, rgba(33,88,155,1) 100%)',
        boxShadow: '0 32px 76px rgba(15,46,83,0.32)'
      }
    }
  },
  secondaryBtn: {
    children: 'Talk to Tasheel',
    href: '/contact?intent=consult',
    sx: {
      bgcolor: 'common.white',
      borderColor: 'primary.light',
      color: 'primary.main',
      '&:hover': {
        bgcolor: 'primary.lighter',
        borderColor: 'primary.main',
        color: 'primary.darker'
      }
    }
  },
  videoSrc: null,
  videoThumbnail: null,
  illustration: {
    eyebrow: 'Workspace preview',
    title: 'Tasheel client dashboard (beta)',
    subtitle: 'A single place to upload documents, approve quotes, and stay in sync with Tasheel project teams.',
    bullets: ['Secure document locker with version history', 'Milestone timeline and turnaround SLAs', 'One-click approvals and feedback threads'],
    stats: [
      { label: 'Active requests', value: '08' },
      { label: 'Avg. turnaround', value: '2.3 days' },
      { label: 'Client satisfaction', value: '4.9★' }
    ]
  },
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
