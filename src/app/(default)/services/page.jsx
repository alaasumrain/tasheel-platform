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
  { id: 'business', name: 'Business', icon: 'tabler-building' },
  { id: 'health', name: 'Healthcare', icon: 'tabler-heart-plus' },
  { id: 'transport', name: 'Transport', icon: 'tabler-car' },
  { id: 'property', name: 'Property', icon: 'tabler-home' },
  { id: 'education', name: 'Education', icon: 'tabler-school' },
  { id: 'finance', name: 'Finance', icon: 'tabler-receipt-tax' }
];

// Mock Services Data
const servicesData = [
  {
    id: 1,
    title: 'Work Permit Application',
    slug: 'work-permit',
    category: 'business',
    icon: 'tabler-briefcase',
    color: 'primary',
    popular: true,
    description: 'Apply for work permits and employment authorizations online.',
    processingTime: '3-5 days',
    fee: '150',
    requirements: ['Valid passport', 'Employment contract', 'Medical certificate'],
    eligibility: 'Foreign nationals with job offers'
  },
  {
    id: 2,
    title: 'Business License',
    slug: 'business-license',
    category: 'business',
    icon: 'tabler-building-store',
    color: 'success',
    popular: true,
    description: 'Register your business and obtain necessary licenses.',
    processingTime: '5-7 days',
    fee: '250',
    requirements: ['Business plan', 'Proof of address', 'Bank statement'],
    eligibility: 'Entrepreneurs and business owners'
  },
  {
    id: 3,
    title: 'National ID Card',
    slug: 'national-id',
    category: 'identity',
    icon: 'tabler-id-badge',
    color: 'info',
    popular: true,
    description: 'Apply for new or renew your national identity card.',
    processingTime: '2-3 days',
    fee: '50',
    requirements: ['Birth certificate', 'Proof of residence', 'Photos'],
    eligibility: 'All citizens aged 16 and above'
  },
  {
    id: 4,
    title: 'Driving License',
    slug: 'driving-license',
    category: 'transport',
    icon: 'tabler-license',
    color: 'warning',
    popular: true,
    description: 'Apply for new driving license or convert existing one.',
    processingTime: '1-2 days',
    fee: '100',
    requirements: ['Eye test', 'Theory test pass', 'Valid ID'],
    eligibility: 'Residents aged 18 and above'
  },
  {
    id: 5,
    title: 'Birth Certificate',
    slug: 'birth-certificate',
    category: 'identity',
    icon: 'tabler-certificate',
    color: 'secondary',
    popular: false,
    description: 'Obtain official birth certificates for newborns or replacements.',
    processingTime: '1 day',
    fee: '25',
    requirements: ['Hospital notification', 'Parents IDs'],
    eligibility: 'Parents or legal guardians'
  },
  {
    id: 6,
    title: 'Health Insurance Card',
    slug: 'health-card',
    category: 'health',
    icon: 'tabler-heart-plus',
    color: 'error',
    popular: true,
    description: 'Get your government health insurance card for medical services.',
    processingTime: '3-5 days',
    fee: 'Free',
    requirements: ['National ID', 'Proof of residence', 'Employment letter'],
    eligibility: 'All citizens and legal residents'
  },
  {
    id: 7,
    title: 'Property Registration',
    slug: 'property-registration',
    category: 'property',
    icon: 'tabler-building-skyscraper',
    color: 'primary',
    popular: false,
    description: 'Register property ownership and transfer procedures.',
    processingTime: '10-15 days',
    fee: '500',
    requirements: ['Title deed', 'Purchase agreement', 'Tax clearance'],
    eligibility: 'Property owners and buyers'
  },
  {
    id: 8,
    title: 'Marriage Certificate',
    slug: 'marriage-certificate',
    category: 'identity',
    icon: 'tabler-heart',
    color: 'error',
    popular: false,
    description: 'Apply for marriage certificates and registration.',
    processingTime: '1-2 days',
    fee: '75',
    requirements: ['IDs of both parties', 'Witnesses', 'Marriage contract'],
    eligibility: 'Couples planning to marry'
  },
  {
    id: 9,
    title: 'School Enrollment',
    slug: 'school-enrollment',
    category: 'education',
    icon: 'tabler-school',
    color: 'info',
    popular: false,
    description: 'Register children for public school enrollment.',
    processingTime: '2-3 days',
    fee: 'Free',
    requirements: ['Birth certificate', 'Vaccination record', 'Proof of residence'],
    eligibility: 'Parents of school-age children'
  },
  {
    id: 10,
    title: 'Tax Registration',
    slug: 'tax-registration',
    category: 'finance',
    icon: 'tabler-receipt-tax',
    color: 'success',
    popular: false,
    description: 'Register for personal or business tax identification.',
    processingTime: '1-2 days',
    fee: 'Free',
    requirements: ['National ID', 'Employment contract', 'Bank details'],
    eligibility: 'Employed individuals and businesses'
  },
  {
    id: 11,
    title: 'Passport Application',
    slug: 'passport',
    category: 'identity',
    icon: 'tabler-passport',
    color: 'primary',
    popular: true,
    description: 'Apply for new passport or renewal services.',
    processingTime: '7-10 days',
    fee: '200',
    requirements: ['National ID', 'Birth certificate', 'Photos'],
    eligibility: 'All citizens'
  },
  {
    id: 12,
    title: 'Vehicle Registration',
    slug: 'vehicle-registration',
    category: 'transport',
    icon: 'tabler-car',
    color: 'warning',
    popular: false,
    description: 'Register new vehicles or transfer ownership.',
    processingTime: '1-2 days',
    fee: '150',
    requirements: ['Purchase invoice', 'Insurance', 'Inspection certificate'],
    eligibility: 'Vehicle owners'
  }
];

// Service Card Component
const ServiceCard = ({ service, index }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <GraphicsCard
        sx={{
          height: '100%',
          position: 'relative',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: theme.shadows[8],
            '& .service-arrow': {
              transform: 'translateX(4px)'
            }
          }
        }}
      >
        {service.popular && (
          <Chip
            label="Popular"
            size="small"
            color="error"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 1,
              fontWeight: 600
            }}
          />
        )}
        
        <CardContent sx={{ p: 3, height: '100%' }}>
          <Stack spacing={3} sx={{ height: '100%' }}>
            {/* Header */}
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: `${service.color}.lighter`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <SvgIcon
                  name={service.icon}
                  size={24}
                  color={`${service.color}.main`}
                />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.description}
                </Typography>
              </Box>
            </Stack>

            {/* Details */}
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <SvgIcon name="tabler-clock" size={16} color="text.secondary" />
                <Typography variant="body2" color="text.secondary">
                  Processing: {service.processingTime}
                </Typography>
              </Stack>
              
              <Stack direction="row" spacing={1} alignItems="center">
                <SvgIcon name="tabler-receipt" size={16} color="text.secondary" />
                <Typography variant="body2" color="text.secondary" component="span">
                  Fee: 
                </Typography>
                {service.fee === 'Free' ? (
                  <Chip label="Free" size="small" color="success" sx={{ height: 20 }} />
                ) : (
                  <Typography variant="body2" color="text.secondary" component="span">
                    ${service.fee}
                  </Typography>
                )}
              </Stack>
              
              <Stack direction="row" spacing={1} alignItems="flex-start">
                <SvgIcon name="tabler-users" size={16} color="text.secondary" />
                <Typography variant="body2" color="text.secondary">
                  {service.eligibility}
                </Typography>
              </Stack>
            </Stack>

            {/* Action */}
            <Button
              fullWidth
              variant="contained"
              color={service.color}
              endIcon={
                <SvgIcon 
                  name="tabler-arrow-right" 
                  size={18}
                  className="service-arrow"
                  sx={{ transition: 'transform 0.3s ease' }}
                />
              }
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typeset
              heading="Government Services Portal"
              caption="Access all government services in one place. Apply online, track your applications, and receive your documents digitally."
              stackProps={{ sx: { textAlign: 'center', maxWidth: 800, mx: 'auto' } }}
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
                <Grid container spacing={3}>
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service, index) => (
                      <Grid item xs={12} sm={6} md={4} lg={4} key={service.id}>
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

          {/* Stats Section */}
          {!loading && filteredServices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <GraphicsCard sx={{ p: 3, mt: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4} md={4}>
                    <Stack alignItems="center" spacing={1}>
                      <Typography variant="h3" color="primary.main">
                        {filteredServices.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Available Services
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Stack alignItems="center" spacing={1}>
                      <Typography variant="h3" color="success.main">
                        24/7
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Online Access
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <Stack alignItems="center" spacing={1}>
                      <Typography variant="h3" color="info.main">
                        70%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Faster Processing
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </GraphicsCard>
            </motion.div>
          )}
        </Stack>
      </ContainerWrapper>
    </Box>
  );
}