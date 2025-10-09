'use client';
import PropTypes from 'prop-types';

import { useEffect, useRef, useState } from 'react';

// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { motion, useScroll, useTransform } from 'motion/react';

// @project
import ButtonAnimationWrapper from '@/components/ButtonAnimationWrapper';
import TasheelButton from '@/components/TasheelButton';
import { GraphicsCard } from '@/components/cards';
import ContainerWrapper from '@/components/ContainerWrapper';
import SvgIcon from '@/components/SvgIcon';
import { SECTION_COMMON_PY } from '@/utils/constant';
import { getBackgroundDots } from '@/utils/getBackgroundDots';

// @assets
import Wave from '@/images/graphics/Wave';

// threshold - adjust threshold as needed
const options = { root: null, rootMargin: '0px', threshold: 0.6 };

/***************************  HERO - 17  ***************************/

/**
 *
 * Demos:
 * - [Hero17](https://www.saasable.io/blocks/hero/hero17)
 *
 * API:
 * - [Hero17 API](https://phoenixcoded.gitbook.io/saasable/ui-kit/development/components/hero/hero17#props-details)
 */

export default function Hero17({
  chip = { label: '' },
  headLine = '',
  captionLine = '',
  primaryBtn = {},
  secondaryBtn,
  videoSrc,
  videoThumbnail,
  listData = [],
  illustration
}) {
  const theme = useTheme();
  const boxRadius = { xs: 24, sm: 32, md: 40 };

  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const scale = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.4, 0.6], [0.9, 0.92, 0.94, 0.96, 1]);

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle video play/pause based on intersection with the viewport
  useEffect(() => {
    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (videoRef.current && !isPlaying) {
            videoRef.current
              .play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch((error) => {
                console.error('Autoplay was prevented:', error);
              });
          }
        } else {
          if (videoRef.current && isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    const videoElement = videoRef.current;

    if (videoElement) {
      observer.observe(videoElement);
    }

    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, [isPlaying]);

  return (
    <>
      <Box
        sx={{
          height: { xs: 520, sm: 660, md: 780 },
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1,
          zIndex: -1,
          borderBottomLeftRadius: boxRadius,
          borderBottomRightRadius: boxRadius,
          backgroundImage: `${getBackgroundDots(alpha(theme.palette.primary.light, 0.16), 60, 35)}, linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, ${alpha(theme.palette.primary.light, 0.18)} 55%, ${alpha(theme.palette.primary.lighter, 0.24)} 100%)`,
          backgroundBlendMode: 'overlay',
          bgcolor: alpha(theme.palette.primary.lighter, 0.12)
        }}
      />
      <ContainerWrapper sx={{ py: SECTION_COMMON_PY, pb: { xs: 6, sm: 8, md: 9 } }}>
        <Box ref={containerRef}>
          <Box sx={{ pb: { xs: 4, sm: 6, md: 8 } }}>
            <Stack sx={{ alignItems: 'center', gap: 1.5 }}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
              >
                <Chip
                  label={chip.label}
                  sx={{
                    borderRadius: 999,
                    px: 2,
                    py: 0.75,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.18),
                    bgcolor: alpha(theme.palette.primary.light, 0.24),
                    color: theme.palette.primary.darker,
                    fontWeight: 600,
                    letterSpacing: 0.8,
                    textTransform: typeof chip.label === 'string' ? 'uppercase' : 'none',
                    '& .MuiChip-label': {
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.75
                    }
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
              >
                <Typography variant="h1" align="center" sx={{ maxWidth: 800 }}>
                  {headLine}
                </Typography>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.25, ease: 'easeOut' }}
              >
                <Box sx={{ pt: 0.5, pb: 0.75 }}>
                  <Wave />
                </Box>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
              >
                <Typography variant="h6" align="center" sx={{ color: 'text.secondary', maxWidth: 650 }}>
                  {captionLine}
                </Typography>
              </motion.div>
            </Stack>
            <Stack sx={{ alignItems: 'center', gap: 2, mt: { xs: 3, sm: 4, md: 5 } }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.75} alignItems="center">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  whileHover={{ scale: 1.04 }}
                >
                  <ButtonAnimationWrapper>
                    <TasheelButton
                      variant="contained"
                      startIcon={<SvgIcon name="tabler-sparkles" size={16} stroke={3} color="#fff" />}
                      {...primaryBtn}
                      sx={{
                        px: 3.75,
                        py: 1.15,
                        fontSize: '1rem',
                        ...(primaryBtn?.sx || {})
                      }}
                    />
                  </ButtonAnimationWrapper>
                </motion.div>
                {secondaryBtn && (
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.1, ease: 'easeOut' }}
                    whileHover={{ scale: 1.04 }}
                  >
                    <TasheelButton
                      variant="outlined"
                      color="primary"
                      {...secondaryBtn}
                      sx={{
                        px: 3.25,
                        py: 1.05,
                        fontSize: '1rem',
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1)
                        },
                        ...(secondaryBtn?.sx || {})
                      }}
                    />
                  </motion.div>
                )}
              </Stack>
              <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                {listData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: index * 0.08, ease: 'linear' }}
                  >
                    <Chip
                      label={item.title}
                      variant="outlined"
                      icon={item.icon ? <span style={{ fontSize: 16 }}>{item.icon}</span> : item.image ? <GraphicsImage image={item.image} sx={{ width: 16, height: 16 }} /> : null}
                      slotProps={{
                        label: {
                          sx: { py: 0.6, px: 1.25, typography: 'caption2', fontWeight: 600, letterSpacing: 0.3 }
                        }
                      }}
                      sx={{
                        height: 32,
                        px: 1.25,
                        borderRadius: 999,
                        borderColor: alpha(theme.palette.primary.main, 0.16),
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                        color: theme.palette.primary.darker
                      }}
                    />
                  </motion.div>
                ))}
              </Stack>
            </Stack>
          </Box>
          {(videoSrc || illustration) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 0.9 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3 }}
              style={{ scale }}
            >
              <GraphicsCard
                sx={{
                  border: '5px solid',
                  borderColor: videoSrc ? 'grey.300' : 'transparent',
                  px: { xs: 2.5, sm: 3.5, md: 4 },
                  py: { xs: 3, sm: 4 },
                  mx: 'auto',
                  maxWidth: 960,
                  background: !videoSrc
                    ? illustration?.background || 'linear-gradient(140deg, rgba(15,46,83,0.08), rgba(15,46,83,0.02))'
                    : undefined,
                  boxShadow: !videoSrc ? '0 32px 80px rgba(15,46,83,0.12)' : undefined
                }}
              >
                {videoSrc ? (
                  <video
                    playsInline
                    ref={videoRef}
                    width="100%"
                    height="100%"
                    style={{ display: 'flex', objectFit: 'cover', borderRadius: 24 }}
                    preload="metadata"
                    autoPlay={false}
                    loop={true}
                    muted={true}
                    poster={videoThumbnail}
                  >
                    <source src={videoSrc} type="video/mp4" />
                  </video>
                ) : (
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 3, md: 4 }}
                    sx={{ alignItems: { xs: 'stretch', md: 'center' } }}
                  >
                    <Stack spacing={1.5} sx={{ flex: 1 }}>
                      {illustration?.eyebrow && (
                        <Typography variant="overline" sx={{ letterSpacing: 1, color: 'primary.main' }}>
                          {illustration.eyebrow}
                        </Typography>
                      )}
                      {illustration?.title && (
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {illustration.title}
                        </Typography>
                      )}
                      {illustration?.subtitle && (
                        <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 520 }}>
                          {illustration.subtitle}
                        </Typography>
                      )}
                      {illustration?.bullets && illustration.bullets.length > 0 && (
                        <Stack spacing={1.25} sx={{ mt: 1.5 }}>
                          {illustration.bullets.map((item, idx) => (
                            <Stack key={idx} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                              <SvgIcon name="tabler-circle-check" size={16} color="primary.main" />
                              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                                {item}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      )}
                    </Stack>
                    {illustration?.stats && illustration.stats.length > 0 && (
                      <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{
                          flexWrap: 'wrap',
                          justifyContent: { xs: 'flex-start', md: 'center' },
                          minWidth: { md: 260 }
                        }}
                      >
                        {illustration.stats.map((metric, idx) => (
                          <Stack
                            key={idx}
                            spacing={0.5}
                            sx={{
                              px: 2,
                              py: 1.5,
                              borderRadius: 3,
                              minWidth: 120,
                              bgcolor: 'common.white',
                              boxShadow: '0 12px 30px rgba(15,46,83,0.12)'
                            }}
                          >
                            <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                              {metric.value}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.6 }}>
                              {metric.label}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                )}
              </GraphicsCard>
            </motion.div>
          )}
        </Box>
      </ContainerWrapper>
    </>
  );
}

Hero17.propTypes = {
  chip: PropTypes.object,
  headLine: PropTypes.string,
  captionLine: PropTypes.string,
  primaryBtn: PropTypes.any,
  videoSrc: PropTypes.string,
  videoThumbnail: PropTypes.string,
  listData: PropTypes.array,
  illustration: PropTypes.shape({
    background: PropTypes.string,
    eyebrow: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    bullets: PropTypes.arrayOf(PropTypes.string),
    stats: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) }))
  })
};
