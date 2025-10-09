import PropTypes from 'prop-types';

// @mui
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function QueueTable({
  rows,
  columns,
  getRowId,
  size = 'medium',
  tableProps,
  rowProps
}) {
  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table size={size} aria-labelledby="table" {...tableProps}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} sx={column.headSx}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={getRowId(row)}
                hover
                role="checkbox"
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                tabIndex={-1}
                {...(rowProps ? rowProps(row) : null)}
              >
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align} sx={column.cellSx}>
                    {column.render ? column.render(row) : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

QueueTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      align: PropTypes.oneOf(['inherit', 'left', 'center', 'right', 'justify']),
      render: PropTypes.func,
      headSx: PropTypes.object,
      cellSx: PropTypes.object
    })
  ).isRequired,
  getRowId: PropTypes.func,
  size: PropTypes.oneOf(['small', 'medium']),
  tableProps: PropTypes.object,
  rowProps: PropTypes.func
};

QueueTable.defaultProps = {
  rows: [],
  getRowId: (row) => row.id,
  size: 'medium',
  tableProps: undefined,
  rowProps: undefined
};
