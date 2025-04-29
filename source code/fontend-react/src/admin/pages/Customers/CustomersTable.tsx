import React, { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchAllCustomers, deleteCustomer } from '../../../Redux Toolkit/Admin/AdminCustomerSlice';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const CustomersTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { customers, loading } = useAppSelector((state) => state.adminCustomers);

  useEffect(() => {
    dispatch(fetchAllCustomers(localStorage.getItem('jwt') || ''));
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customers table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>Mobile</StyledTableCell>
            <StyledTableCell align="right">Delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers?.map((customer) => (
            <StyledTableRow key={customer.id}>
              <StyledTableCell component="th" scope="row">
                {customer.fullName}
              </StyledTableCell>
              <StyledTableCell>{customer.email}</StyledTableCell>
              <StyledTableCell>{customer.mobile}</StyledTableCell>
              <StyledTableCell align="right">
                <IconButton
                  onClick={() =>
                    dispatch(
                      deleteCustomer({ id: customer.id || 0, jwt: localStorage.getItem('jwt') || '' })
                    )
                  }
                >
                  <DeleteOutlineIcon color="error" />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomersTable;