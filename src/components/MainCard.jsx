import PropTypes from 'prop-types';

// material-ui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';

// header style
const headerSX = {
  p: 2.5,
  '& .MuiCardHeader-action': { m: '0px auto', alignSelf: 'center' }
};

export default function MainCard({
  border = true,
  boxShadow,
  children,
  subheader,
  content = true,
  contentSX = {},
  darkTitle,
  divider = true,
  elevation,
  secondary,
  shadow,
  sx = {},
  title,
  modal = false,
  ...others
}) {
  const defaultContentSX = { p: 2.5 };
  return (
    <Card
      elevation={elevation || 0}
      sx={[
        (theme) => ({
          position: 'relative',
          border: border ? '1px solid' : 'none',
          borderRadius: 2,
          borderColor: theme.palette.divider,
          boxShadow: boxShadow && !border ? shadow || '0 8px 24px rgba(15, 46, 83, 0.12)' : 'inherit',
          ':hover': {
            boxShadow: boxShadow ? shadow || '0 12px 32px rgba(15, 46, 83, 0.16)' : 'inherit'
          },
          ...(modal && {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: `calc(100% - 50px)`, sm: 'auto' },
            maxWidth: 768,
            '& .MuiCardContent-root': { overflowY: 'auto', minHeight: 'auto', maxHeight: `calc(100vh - 200px)` }
          })
        }),
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
      {...others}
    >
      {/* card header and action */}
      {!darkTitle && title && (
        <CardHeader sx={headerSX} slotProps={{ title: { variant: 'subtitle1' } }} title={title} action={secondary} subheader={subheader} />
      )}

      {/* content & header divider */}
      {title && divider && <Divider />}

      {/* card content */}
      {content && <CardContent sx={{ ...defaultContentSX, ...contentSX }}>{children}</CardContent>}
      {!content && children}
    </Card>
  );
}

MainCard.propTypes = {
  border: PropTypes.bool,
  boxShadow: PropTypes.bool,
  children: PropTypes.node,
  subheader: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  content: PropTypes.bool,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  divider: PropTypes.bool,
  elevation: PropTypes.number,
  secondary: PropTypes.any,
  shadow: PropTypes.string,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  modal: PropTypes.bool
};
