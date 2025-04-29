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
import { fetchAllProductsAdmin, deleteProduct } from '../../../Redux Toolkit/Admin/AdminProductSlice';

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

const ProductsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.adminProducts);

  useEffect(() => {
    dispatch(fetchAllProductsAdmin(localStorage.getItem('jwt') || ''));
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="products table">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Title</StyledTableCell>
            <StyledTableCell>Price</StyledTableCell>
            <StyledTableCell>Quantity</StyledTableCell>
            <StyledTableCell align="right">Delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products?.map((product) => (
            <StyledTableRow key={product.id}>
              <StyledTableCell component="th" scope="row">
                {product.id}
              </StyledTableCell>
              <StyledTableCell>{product.title}</StyledTableCell>
              <StyledTableCell>{product.sellingPrice}</StyledTableCell>
              <StyledTableCell>{product.quantity}</StyledTableCell>
              <StyledTableCell align="right">
                <IconButton
                  onClick={() =>
                    dispatch(
                      deleteProduct({ id: product.id || 0, jwt: localStorage.getItem('jwt') || '' })
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

export default ProductsTable;