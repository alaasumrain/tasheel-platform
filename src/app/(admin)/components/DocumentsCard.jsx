'use client';

import PropTypes from 'prop-types';

// @mui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TasheelButton from '@/components/TasheelButton';
import Box from '@mui/material/Box';

import SvgIcon from '@/components/SvgIcon';

export default function DocumentsCard({ attachments }) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Uploaded documents
        </Typography>
        <Stack spacing={2}>
          {attachments.map((file) => (
            <FileItem key={file.id} file={file} />
          ))}
          {!attachments.length && (
            <Typography variant="body2" color="text.secondary">
              No documents uploaded.
            </Typography>
          )}
        </Stack>
        <TasheelButton variant="outlined" size="small" sx={{ mt: 2 }} disabled>
          Upload additional file
        </TasheelButton>
      </CardContent>
    </Card>
  );
}

DocumentsCard.propTypes = {
  attachments: PropTypes.array
};

function FileItem({ file }) {
  const formattedSize = file.fileSize
    ? `${(file.fileSize / (1024 * 1024)).toFixed(2)} MB`
    : '';
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <SvgIcon name="tabler-paperclip" size={20} />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {file.fileName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formattedSize}
          </Typography>
        </Box>
      </Box>
      <TasheelButton variant="outlined" size="small" href={file.url || '#'} disabled={!file.url}>
        {file.url ? 'Download' : 'Pending'}
      </TasheelButton>
    </Box>
  );
}

FileItem.propTypes = {
  file: PropTypes.shape({
    fileName: PropTypes.string,
    fileSize: PropTypes.number,
    url: PropTypes.string
  })
};
