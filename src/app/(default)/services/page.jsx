'use client';

import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TasheelButton from '@/components/TasheelButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Fade from '@mui/material/Fade';
import useMediaQuery from '@mui/material/useMediaQuery';

// @third-party
import { motion } from 'motion/react';

// @project
import ContainerWrapper from '@/components/ContainerWrapper';
import SvgIcon from '@/components/SvgIcon';
import Typeset from '@/components/Typeset';
import {
  serviceCategories,
  serviceCategoryCounts,
  serviceCategoryLookup,
  servicesCatalogue
} from '@/data/services';
import { SECTION_COMMON_PY } from '@/utils/constant';

const categoryLookup = serviceCategoryLookup;

/***************************  SERVICES PAGE  ***************************/

// Service Card Component
const ServiceCard = ({ service, index }) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ scale: 1.01 }}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          height: '100%',
          minHeight: { xs: 320, md: 360 },
          display: 'flex',
          flexDirection: 'column',
          borderRadius: { xs: 3, md: 4 },
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.08),
          background: `linear-gradient(165deg, ${alpha(theme.palette.background.paper, 0.98)}, ${alpha(theme.palette.primary.lighter, 0.18)})`,
          transition: 'all 0.35s ease',
          boxShadow: '0 18px 48px rgba(15, 46, 83, 0.08)',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 28px 60px rgba(15, 46, 83, 0.16)'
          }
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3 }, height: '100%' }}>
          <Stack spacing={3} sx={{ height: '100%' }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.14),
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <SvgIcon name={service.icon} size={28} />
              </Box>
              <Stack spacing={1} sx={{ flex: 1 }}>
                {service.category !== 'all' && (
                  <Typography variant="overline" sx={{ letterSpacing: 0.6, color: 'primary.main', fontWeight: 700 }}>
                    {categoryLookup[service.category]?.name ?? 'Tasheel service'}
                  </Typography>
                )}
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {service.description}
                </Typography>
              </Stack>
            </Stack>

            <Stack spacing={1.75}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  size="small"
                  icon={<SvgIcon name="tabler-clock" size={16} />}
                  label={service.processingTime}
                  sx={{ borderRadius: 1.5, fontWeight: 500 }}
                />
              </Stack>

              <Stack direction="row" spacing={1} alignItems="flex-start">
                <SvgIcon name="tabler-target" size={18} color="text.secondary" sx={{ mt: 0.3 }} />
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {service.eligibility}
                </Typography>
              </Stack>

              <Divider sx={{ borderStyle: 'dashed', borderColor: 'divider' }} />

              <Stack spacing={0.75}>
                <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, color: 'text.secondary' }}>
                  Engagement essentials
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {service.requirements.slice(0, 3).map((item) => (
                    <Chip key={item} label={item} size="small" variant="outlined" sx={{ borderRadius: 999, borderColor: 'divider' }} />
                  ))}
                  {service.requirements.length > 3 && (
                    <Chip label={`+${service.requirements.length - 3} more`} size="small" variant="outlined" sx={{ borderRadius: 999 }} />
                  )}
                </Stack>
              </Stack>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 'auto' }}>
              <TasheelButton
                component={NextLink}
                href={`/quote?service=${service.slug}`}
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  borderRadius: 1.5,
                  fontWeight: 600,
                  py: 1.1
                }}
                endIcon={<SvgIcon name="tabler-arrow-right" size={18} />}
              >
                Request a quote
              </TasheelButton>
              <TasheelButton
                component={NextLink}
                href={`/contact?service=${service.slug}&intent=consult`}
                variant="outlined"
                size="large"
                fullWidth
                sx={{
                  borderRadius: 1.5,
                  fontWeight: 600,
                  py: 1.1
                }}
                endIcon={<SvgIcon name="tabler-calendar" size={18} />}
              >
                Talk to an expert
              </TasheelButton>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

ServiceCard.propTypes = {
  service: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
};

export default function ServicesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Filter services
  const filteredServices = useMemo(() => {
    return servicesCatalogue.filter((service) => {
      const matchesSearch = searchQuery === '' ||
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Category counts
  const categoryCounts = useMemo(() => serviceCategoryCounts, []);

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory !== null) {
      setSelectedCategory(newCategory);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        position: 'relative',
        '&:before': {
          content: "''",
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(120% 120% at 50% -10%, ${alpha(theme.palette.primary.light, 0.18)} 0%, transparent 55%)`,
          pointerEvents: 'none'
        }
      }}
    >
      <ContainerWrapper sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={6}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <Card
              sx={{
                borderRadius: 4,
                px: { xs: 3.5, md: 6 },
                py: { xs: 4, md: 6 },
                textAlign: 'center',
                background: 'linear-gradient(138deg, rgba(15,46,83,0.14), rgba(15,46,83,0))',
                boxShadow: '0 32px 72px rgba(15,46,83,0.18)'
              }}
            >
              <Stack spacing={2.5} alignItems="center">
                <Chip
                  label="Tasheel language services"
                  color="primary"
                  sx={{ borderRadius: 999, px: 2.5, py: 0.5, fontWeight: 600 }}
                />
                <Typography variant="h3" sx={{ fontWeight: 800, maxWidth: 760 }}>
                  Pick the translation, localisation, or interpreting programme that fits your launch plan
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 780 }}>
                  Every service comes with vetted linguists, transparent turnaround windows, and secure storage. Filter by category or search for industry-specific expertise to get started.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap" justifyContent="center">
                  <TasheelButton component={NextLink} href="/quote" variant="contained" size="large" sx={{ borderRadius: 999, px: 3.5 }}>
                    Start a quote
                  </TasheelButton>
                  <TasheelButton component={NextLink} href="/contact?intent=consult" variant="outlined" size="large" sx={{ borderRadius: 999, px: 3.5 }}>
                    Book a consultation
                  </TasheelButton>
                </Stack>
              </Stack>
            </Card>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Paper
              elevation={0}
              sx={{
                px: 2,
                py: 1.25,
                display: 'flex',
                alignItems: 'center',
                maxWidth: 640,
                mx: 'auto',
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: 999,
                bgcolor: alpha(theme.palette.background.paper, 0.9),
                boxShadow: '0 18px 40px rgba(28, 72, 119, 0.06)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: '0 22px 55px rgba(28, 72, 119, 0.12)'
                }
              }}
            >
              <IconButton sx={{ p: 1 }} color="primary">
                <SvgIcon name="tabler-search" size={20} />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search for services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <IconButton onClick={() => setSearchQuery('')} sx={{ p: 1 }} color="primary">
                  <SvgIcon name="tabler-x" size={20} />
                </IconButton>
              )}
            </Paper>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1.5 }}>
              <ToggleButtonGroup
                value={selectedCategory}
                exclusive
                onChange={handleCategoryChange}
                sx={{
                  flexWrap: 'wrap',
                  gap: 1.5,
                  '& .MuiToggleButton-root': {
                    borderRadius: 999,
                    textTransform: 'none',
                    px: 2.5,
                    py: 1.05,
                    minWidth: 200,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.12),
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      bgcolor: alpha(theme.palette.primary.main, 0.1)
                    },
                    '&.Mui-selected': {
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      borderColor: theme.palette.primary.main,
                      boxShadow: '0 16px 36px rgba(15,46,83,0.18)'
                    }
                  }
                }}
              >
                {serviceCategories.map((cat) => (
                  <ToggleButton key={cat.id} value={cat.id}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SvgIcon name={cat.icon} size={18} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {cat.name}
                      </Typography>
                      <Chip
                        label={categoryCounts[cat.id] || 0}
                        size="small"
                        sx={{ height: 20, minWidth: 24, bgcolor: 'background.paper' }}
                      />
                    </Stack>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          </motion.div>

          {/* Services Grid */}
          {loading ? (
            <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
              {[...Array(6)].map((_, index) => (
                <Grid xs={12} sm={6} md={4} lg={3} key={index} sx={{ display: 'flex' }}>
                  <Skeleton variant="rounded" height={320} sx={{ flexGrow: 1 }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Fade in={!loading}>
              <Box>
                <Grid
                  container
                  spacing={3}
                  sx={{
                    alignItems: 'stretch'
                  }}
                >
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service, index) => (
                      <Grid xs={12} sm={6} md={4} lg={3} key={service.id} sx={{ display: 'flex' }}>
                        <ServiceCard service={service} index={index} />
                      </Grid>
                    ))
                  ) : (
                    <Grid xs={12}>
                      <Box sx={{ textAlign: 'center', py: 8 }}>
                        <SvgIcon name="tabler-search-off" size={64} color="text.disabled" />
                        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                          No services found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Try adjusting your search or filter criteria
                        </Typography>
                        <TasheelButton
                          variant="outlined"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('all');
                          }}
                          sx={{ mt: 3 }}
                        >
                          Clear Filters
                        </TasheelButton>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Fade>
          )}

        </Stack>
      </ContainerWrapper>
    </Box>
  );
}
