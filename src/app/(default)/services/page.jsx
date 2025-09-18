'use client';

import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
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
import { GraphicsCard } from '@/components/cards';
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
      whileHover={{ scale: 1.02 }}
    >
      <GraphicsCard
        sx={{
          height: '100%',
          minHeight: { xs: 340, sm: 380, md: 400 },
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[4]
          }
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3 }, height: '100%' }}>
          <Stack spacing={2.5} sx={{ height: '100%' }}>
            {/* Header */}
            <Stack spacing={1.5}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: 'primary.lighter',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <SvgIcon
                  name={service.icon}
                  size={28}
                  color="primary.main"
                />
              </Box>
              <Box>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {service.description}
                </Typography>
              </Box>
            </Stack>

            {/* Details */}
            <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <SvgIcon name="tabler-clock" size={16} color="text.secondary" />
                <Typography variant="body2" color="text.secondary">
                  {service.processingTime}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <SvgIcon name="tabler-receipt" size={16} color="text.secondary" />
                <Typography variant="body2" color="text.secondary">
                  Fee: {service.fee === 'Free' ? 'Free' : `$${service.fee}`}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="flex-start">
                <SvgIcon name="tabler-users" size={16} color="text.secondary" sx={{ mt: 0.25 }} />
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                  {service.eligibility}
                </Typography>
              </Stack>
            </Stack>

            {/* Action */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                borderRadius: 1.5,
                fontWeight: 600,
                py: 1.25
              }}
            >
              Apply Now
            </Button>
          </Stack>
        </CardContent>
      </GraphicsCard>
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
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
      <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
        <Stack spacing={6}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' }}
          >
            <Typeset
              heading="Government Services"
              caption="Browse digital services available through Tasheel. Apply online, upload documents, and track progress from submission to completion."
              stackProps={{ sx: { textAlign: 'center', maxWidth: 700, mx: 'auto' } }}
            />
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
                p: 1,
                display: 'flex',
                alignItems: 'center',
                maxWidth: 600,
                mx: 'auto',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.paper',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: theme.shadows[2]
                }
              }}
            >
              <IconButton sx={{ p: 1 }}>
                <SvgIcon name="tabler-search" size={20} />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search for services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <IconButton onClick={() => setSearchQuery('')} sx={{ p: 1 }}>
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
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    textTransform: 'none',
                    px: 2,
                    py: 1,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      borderColor: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.dark'
                      }
                    }
                  }
                }}
              >
                {serviceCategories.map((cat) => (
                  <ToggleButton key={cat.id} value={cat.id}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SvgIcon name={cat.icon} size={18} />
                      <Typography variant="body2">{cat.name}</Typography>
                      <Chip
                        label={categoryCounts[cat.id] || 0}
                        size="small"
                        sx={{ height: 20, minWidth: 24 }}
                      />
                    </Stack>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>
          </motion.div>

          {/* Services Grid */}
          {loading ? (
            <Grid container spacing={3}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                  <Skeleton variant="rounded" height={320} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Fade in={!loading}>
              <Box>
                <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service, index) => (
                      <Grid item xs={12} sm={6} md={4} key={service.id}>
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