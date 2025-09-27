import PropTypes from 'prop-types';
// @next
import NextLink from 'next/link';

// @mui
import TasheelButton from '@/components/TasheelButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import ButtonAnimationWrapper from '@/components/ButtonAnimationWrapper';
import { SECTION_COMMON_PY } from '@/utils/constant';
import ContainerWrapper from '@/components/ContainerWrapper';
import GraphicsImage from '@/components/GraphicsImage';
import SvgIcon from '@/components/SvgIcon';
import { PAGE_PATH } from '@/path';

export default function ProPage({ image }) {
  return (
    <>
      <ContainerWrapper sx={{ py: SECTION_COMMON_PY }}>
        <Box
          sx={{
            bgcolor: 'background.default',
            borderRadius: 7.5
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <GraphicsImage
              image={image}
              sx={{
                width: { xs: '75px', md: '150px' },
                height: { xs: '75px', md: '150px' },
                borderRadius: 0
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, mt: { xs: 4, md: 7 }, textAlign: 'center' }}>
              Need bespoke workflows or department integrations?
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3, color: 'grey.700', textAlign: 'center' }}>
              Tasheel’s product team can help your ministry launch additional modules, automate paper processes, and tailor dashboards
              for specialized service lines.
            </Typography>

            <Grid container spacing={2} justifyContent="center">
              <Grid>
                <TasheelButton
                  variant="outlined"
                  component={NextLink}
                  href={PAGE_PATH.contactPage}
                  sx={{ minWidth: 215 }}
                  startIcon={<SvgIcon name="tabler-message" size={16} stroke={3} />}
                >
                  Talk to our team
                </TasheelButton>
              </Grid>
              <Grid>
                <ButtonAnimationWrapper>
                  <TasheelButton
                    variant="contained"
                    color="primary"
                    component={NextLink}
                    href={PAGE_PATH.aboutPage}
                    startIcon={<SvgIcon name="tabler-sparkles" size={16} stroke={3} color="background.default" />}
                  >
                    Learn about Tasheel
                  </TasheelButton>
                </ButtonAnimationWrapper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </ContainerWrapper>
    </>
  );
}

ProPage.propTypes = { image: PropTypes.any };
