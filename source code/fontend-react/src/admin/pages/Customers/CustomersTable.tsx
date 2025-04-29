import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Box, CircularProgress, IconButton, TableFooter, TablePagination, TextField } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchAllCustomers, deleteCustomer } from '../../../Redux Toolkit/Admin/AdminCustomerSlice';
import { Search } from '@mui/icons-material';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';

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
  const { customers = [], loading } = useAppSelector((state) => state.adminCustomers);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAllCustomers(localStorage.getItem('jwt') || ''));
  }, [dispatch]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteCustomer = (customerId: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      dispatch(deleteCustomer({ 
        id: customerId, 
        jwt: localStorage.getItem('jwt') || '' 
      }));
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.mobile?.includes(searchTerm)
  );

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <TextField
          sx={{ width: 300 }}
          label="Search customers"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: <Search />
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customers table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Mobile</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <StyledTableRow>
                <StyledTableCell colSpan={4} align="center">
                  <CircularProgress />
                </StyledTableCell>
              </StyledTableRow>
            ) : filteredCustomers.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={4} align="center">
                  No customers found
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              (rowsPerPage > 0
                ? filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredCustomers
              ).map((customer) => (
                <StyledTableRow key={customer.id}>
                  <StyledTableCell>{customer.fullName}</StyledTableCell>
                  <StyledTableCell>{customer.email}</StyledTableCell>
                  <StyledTableCell>{customer.mobile}</StyledTableCell>
                  <StyledTableCell align="right">
                    <IconButton
                      onClick={() => handleDeleteCustomer(customer.id || 0)}
                    >
                      <DeleteOutlineIcon color="error" />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={4}
                count={filteredCustomers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
};

export default CustomersTable;