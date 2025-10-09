import PropTypes from 'prop-types';

// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import TasheelButton from '@/components/TasheelButton';
import SvgIcon from '@/components/SvgIcon';

function formatFileSize(size) {
  if (!size && size !== 0) return '';
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function AttachmentListItem({
  file,
  buttonLabel,
  pendingLabel,
  fullWidthOnMobile,
  responsive,
  getButtonProps,
  itemProps
}) {
  const hasUrl = Boolean(file?.url);
  const formattedSize = formatFileSize(file?.fileSize);
  const resolvedButtonProps = getButtonProps ? getButtonProps(file) : {};
  const { sx: buttonSx, ...restButtonProps } = resolvedButtonProps;
  const { sx: itemSx, ...restItemProps } = itemProps || {};

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: responsive ? { xs: 'flex-start', sm: 'center' } : 'center',
        justifyContent: 'space-between',
        flexDirection: responsive ? { xs: 'column', sm: 'row' } : 'row',
        gap: 2,
        ...itemSx
      }}
      {...restItemProps}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: responsive ? '100%' : 'auto' }}>
        <SvgIcon name="tabler-paperclip" size={20} />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
            {file?.fileName || 'Untitled'}
          </Typography>
          {formattedSize && (
            <Typography variant="caption" color="text.secondary">
              {formattedSize}
            </Typography>
          )}
        </Box>
      </Box>
      <TasheelButton
        variant="outlined"
        size="small"
        href={hasUrl ? file.url : '#'}
        disabled={!hasUrl}
        fullWidth={fullWidthOnMobile}
        sx={{
          alignSelf: responsive ? { xs: fullWidthOnMobile ? 'stretch' : 'center', sm: 'center' } : 'center',
          ...buttonSx
        }}
        {...restButtonProps}
      >
        {hasUrl ? buttonLabel : pendingLabel}
      </TasheelButton>
    </Box>
  );
}

AttachmentListItem.propTypes = {
  file: PropTypes.shape({
    id: PropTypes.string,
    fileName: PropTypes.string,
    fileSize: PropTypes.number,
    url: PropTypes.string
  }),
  buttonLabel: PropTypes.string,
  pendingLabel: PropTypes.string,
  fullWidthOnMobile: PropTypes.bool,
  responsive: PropTypes.bool,
  getButtonProps: PropTypes.func,
  itemProps: PropTypes.object
};

export default function AttachmentList({
  files,
  emptyPlaceholder,
  buttonLabel = 'Download',
  pendingLabel = 'Pending',
  fullWidthOnMobile = false,
  responsive = true,
  getButtonProps,
  stackProps,
  itemProps
}) {
  if (!files || files.length === 0) {
    return emptyPlaceholder || null;
  }

  return (
    <Stack spacing={2} {...stackProps}>
      {files.map((file) => (
        <AttachmentListItem
          key={file.id || file.fileName}
          file={file}
          buttonLabel={buttonLabel}
          pendingLabel={pendingLabel}
          fullWidthOnMobile={fullWidthOnMobile}
          responsive={responsive}
          getButtonProps={getButtonProps}
          itemProps={itemProps}
        />
      ))}
    </Stack>
  );
}

AttachmentList.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      fileName: PropTypes.string,
      fileSize: PropTypes.number,
      url: PropTypes.string
    })
  ),
  emptyPlaceholder: PropTypes.node,
  buttonLabel: PropTypes.string,
  pendingLabel: PropTypes.string,
  fullWidthOnMobile: PropTypes.bool,
  responsive: PropTypes.bool,
  getButtonProps: PropTypes.func,
  stackProps: PropTypes.object,
  itemProps: PropTypes.object
};
