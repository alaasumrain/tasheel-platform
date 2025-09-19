'use client';

import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';

// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
import { SECTION_COMMON_PY } from '@/utils/constant';

/***************************  SERVICES PAGE  ***************************/

// Service Categories
const serviceCategories = [
  { id: 'all', name: 'All Services', icon: 'tabler-apps' },
  { id: 'identity', name: 'Identity & Civil', icon: 'tabler-id' },
  { id: 'business', name: 'Business Services', icon: 'tabler-building' },
  { id: 'health', name: 'Health & Safety', icon: 'tabler-heart-plus' },
  { id: 'transport', name: 'Transportation', icon: 'tabler-car' },
  { id: 'property', name: 'Property & Land', icon: 'tabler-home' },
  { id: 'education', name: 'Education', icon: 'tabler-school' }
];

const categoryLookup = serviceCategories.reduce((acc, cat) => {
  acc[cat.id] = cat;
  return acc;
}, {});

// Palestinian Government Services Data
const servicesData = [
  {
    id: 1,
    title: 'Birth Certificate',
    slug: 'birth-certificate',
    category: 'identity',
    icon: 'tabler-certificate',
    description: 'Issue official birth certificates for Palestinian citizens.',
    processingTime: '1-2 business days',
    fee: '25',
    requirements: ['Hospital birth notification', 'Parents national IDs', 'Marriage certificate'],
    eligibility: 'Parents of newborns or guardians'
  },
  {
    id: 2,
    title: 'National ID Card',
    slug: 'national-id',
    category: 'identity',
    icon: 'tabler-id-badge',
    description: 'Apply for new Palestinian national identity card or renewal.',
    processingTime: '3-5 business days',
    fee: '50',
    requirements: ['Birth certificate', 'Family registry', 'Two passport photos'],
    eligibility: 'Palestinian citizens aged 16 and above'
  },
  {
    id: 3,
    title: 'Family Registry Record',
    slug: 'family-registry',
    category: 'identity',
    icon: 'tabler-users',
    description: 'Update family registry with births, marriages, and address changes.',
    processingTime: '2-3 business days',
    fee: '30',
    requirements: ['Supporting documents', 'National ID', 'Proof of change'],
    eligibility: 'Family heads and authorized members'
  },
  {
    id: 4,
    title: 'Business License',
    slug: 'business-license',
    category: 'business',
    icon: 'tabler-building-store',
    description: 'Register new business or renew existing commercial license.',
    processingTime: '5-7 business days',
    fee: '200',
    requirements: ['Trade name reservation', 'Location permit', 'National ID'],
    eligibility: 'Palestinian residents and businesses'
  },
  {
    id: 5,
    title: 'Work Permit',
    slug: 'work-permit',
    category: 'business',
    icon: 'tabler-briefcase',
    description: 'Employment authorization for foreign workers in Palestine.',
    processingTime: '7-10 business days',
    fee: '300',
    requirements: ['Employment contract', 'Passport copy', 'Medical certificate'],
    eligibility: 'Foreign nationals with job offers'
  },
  {
    id: 6,
    title: 'Driving License',
    slug: 'driving-license',
    category: 'transport',
    icon: 'tabler-license',
    description: 'New driving license application or renewal service.',
    processingTime: '3-5 business days',
    fee: '120',
    requirements: ['Traffic test certificate', 'Medical fitness', 'National ID'],
    eligibility: 'Residents aged 18 and above'
  },
  {
    id: 7,
    title: 'Vehicle Registration',
    slug: 'vehicle-registration',
    category: 'transport',
    icon: 'tabler-car',
    description: 'Register new vehicles or transfer ownership.',
    processingTime: '2-3 business days',
    fee: '180',
    requirements: ['Purchase invoice', 'Insurance policy', 'Technical inspection'],
    eligibility: 'Vehicle owners with valid documents'
  },
  {
    id: 8,
    title: 'Health Insurance Registration',
    slug: 'health-insurance',
    category: 'health',
    icon: 'tabler-heart-plus',
    description: 'Enroll in Palestinian government health insurance program.',
    processingTime: '3-5 business days',
    fee: 'Free',
    requirements: ['National ID', 'Employment certificate', 'Residence proof'],
    eligibility: 'Palestinian citizens and residents'
  },
  {
    id: 9,
    title: 'Property Registration',
    slug: 'property-registration',
    category: 'property',
    icon: 'tabler-building-skyscraper',
    description: 'Register property ownership and land transfers.',
    processingTime: '10-15 business days',
    fee: '500',
    requirements: ['Title deed', 'Sale contract', 'Tax clearance certificate'],
    eligibility: 'Property owners and authorized agents'
  },
  {
    id: 10,
    title: 'Building Permit',
    slug: 'building-permit',
    category: 'property',
    icon: 'tabler-building',
    description: 'Construction permits for residential and commercial buildings.',
    processingTime: '15-20 business days',
    fee: '400',
    requirements: ['Architectural plans', 'Land ownership', 'Engineering report'],
    eligibility: 'Property owners and licensed contractors'
  },
  {
    id: 11,
    title: 'School Enrollment',
    slug: 'school-enrollment',
    category: 'education',
    icon: 'tabler-school',
    description: 'Enroll children in Palestinian public schools.',
    processingTime: '2-3 business days',
    fee: 'Free',
    requirements: ['Birth certificate', 'Vaccination record', 'Previous school certificate'],
    eligibility: 'Parents of school-age children'
  },
  {
    id: 12,
    title: 'University Transcript',
    slug: 'university-transcript',
    category: 'education',
    icon: 'tabler-certificate',
    description: 'Official academic transcripts from Palestinian universities.',
    processingTime: '3-5 business days',
    fee: '40',
    requirements: ['Student ID', 'Graduation certificate', 'Request form'],
    eligibility: 'University graduates and current students'
  }
];

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
          minHeight: { xs: 320, sm: 360, md: 380 },
          display: 'flex',
          flexDirection: 'column',
          borderRadius: { xs: 4, sm: 5 },
          border: '1px solid',
          borderColor: 'divider',
          background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.96)}, ${alpha(theme.palette.primary.lighter, 0.14)})`,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          boxShadow: '0 16px 40px rgba(28, 72, 119, 0.04)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 55px rgba(28, 72, 119, 0.12)'
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
                <SvgIcon name="tabler-users" size={18} color="text.secondary" sx={{ mt: 0.3 }} />
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {service.eligibility}
                </Typography>
              </Stack>

              <Divider sx={{ borderStyle: 'dashed', borderColor: 'divider' }} />

              <Stack spacing={0.75}>
                <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, color: 'text.secondary' }}>
                  Required documents
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
              <Button
                component={NextLink}
                href={`/contact?service=${service.slug}`}
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
                Start application
              </Button>
              <Button
                component={NextLink}
                href="/track"
                variant="outlined"
                size="large"
                fullWidth
                sx={{
                  borderRadius: 1.5,
                  fontWeight: 600,
                  py: 1.1
                }}
                endIcon={<SvgIcon name="tabler-external-link" size={18} />}
              >
                Track application
              </Button>
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
    return servicesData.filter(service => {
      const matchesSearch = searchQuery === '' ||
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: servicesData.length };
    servicesData.forEach(service => {
      counts[service.category] = (counts[service.category] || 0) + 1;
    });
    return counts;
  }, []);

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
      <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
        <Stack spacing={6}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' }}
          >
            <Stack spacing={2.5} sx={{ textAlign: 'center', alignItems: 'center' }}>
              <Chip
                label="Tasheel service catalogue"
                color="primary"
                sx={{
                  borderRadius: 999,
                  px: 1.5,
                  fontWeight: 600,
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main
                }}
              />
              <Typeset
                heading="Launch, manage, and track government services online"
                caption="Search the service journeys already digitised with Tasheel. Every listing shares processing times, fees, and required documents so your team and applicants stay ready."
                stackProps={{ sx: { textAlign: 'center', maxWidth: 760, mx: 'auto' } }}
                headingProps={{ sx: { fontSize: { xs: 32, md: 42 }, fontWeight: 800 } }}
                captionProps={{ sx: { fontSize: { xs: 16, md: 18 } } }}
              />
              <Stack direction="row" spacing={1.5} flexWrap="wrap" justifyContent="center" useFlexGap>
                {['Identity & civil records', 'Business & trade licenses', 'Residency & visas', 'Vehicles & transport', 'Property & land affairs'].map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    sx={{
                      borderRadius: 999,
                      bgcolor: alpha(theme.palette.primary.lighter, 0.3),
                      borderColor: 'transparent',
                      fontWeight: 500
                    }}
                  />
                ))}
              </Stack>
            </Stack>
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
            <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
              <ToggleButtonGroup
                value={selectedCategory}
                exclusive
                onChange={handleCategoryChange}
                sx={{
                  flexWrap: 'wrap',
                  gap: 1,
                  '& .MuiToggleButton-root': {
                    borderRadius: 999,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.18),
                    textTransform: 'none',
                    px: 2.25,
                    py: 1,
                    bgcolor: alpha(theme.palette.primary.lighter, 0.12),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      bgcolor: alpha(theme.palette.primary.main, 0.14)
                    },
                    '&.Mui-selected': {
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      borderColor: theme.palette.primary.main,
                      '&:hover': {
                        bgcolor: theme.palette.primary.dark
                      }
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
                <Grid item xs={12} sm={6} md={4} lg={4} key={index} sx={{ display: 'flex' }}>
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
                    justifyContent: 'center',
                    alignItems: 'stretch'
                  }}
                >
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service, index) => (
                      <Grid item xs={12} sm={6} md={4} key={service.id} sx={{ display: 'flex' }}>
                        <ServiceCard service={service} index={index} />
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Box sx={{ textAlign: 'center', py: 8 }}>
                        <SvgIcon name="tabler-search-off" size={64} color="text.disabled" />
                        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                          No services found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Try adjusting your search or filter criteria
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('all');
                          }}
                          sx={{ mt: 3 }}
                        >
                          Clear Filters
                        </Button>
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
