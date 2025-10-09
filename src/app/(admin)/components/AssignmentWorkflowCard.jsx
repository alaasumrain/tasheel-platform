'use client';

import PropTypes from 'prop-types';

// @mui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import TasheelButton from '@/components/TasheelButton';
import SvgIcon from '@/components/SvgIcon';

const assignees = ['Unassigned', 'Layla', 'Yazan', 'Rami'];

export default function AssignmentWorkflowCard({ status }) {
  return (
    <Card sx={{ borderRadius: 3, mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          Assignment & workflow
        </Typography>
        <Stack spacing={2}>
          <TextField select label="Assign to" value={assignees[0]} SelectProps={{ native: true }} disabled>
            {assignees.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </TextField>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <ActionButton label="Send quote" icon="tabler-mail-forward" />
            <ActionButton label="Start project" icon="tabler-player-play" />
            <ActionButton label="Mark completed" icon="tabler-check" />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

AssignmentWorkflowCard.propTypes = {
  status: PropTypes.object
};

function ActionButton({ label, icon, onClick, disabled }) {
  return (
    <TasheelButton variant="outlined" size="small" startIcon={<SvgIcon name={icon} size={18} />} onClick={onClick} disabled={disabled}>
      {label}
    </TasheelButton>
  );
}

ActionButton.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};
