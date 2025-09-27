'use client';
// @project
import SvgIcon from '@/components/SvgIcon';

export const integration = {
  headLine: 'How Tasheel guides your request',
  captionLine: 'A clear path from first contact to final delivery keeps everyone aligned—no guesswork, no hidden steps.',
  primaryBtn: {
    children: 'Start your request',
    startIcon: <SvgIcon name="tabler-compass" color="background.default" />,
    href: '/quote'
  },
  tagList: [
    { label: 'Share your brief or documents' },
    { label: 'Tasheel scopes timeline & cost' },
    { label: 'We assign vetted specialists' },
    { label: 'You review milestones online' },
    { label: 'Tasheel delivers & archives securely' },
    { label: 'Feedback loops improve the next job' }
  ]
};
