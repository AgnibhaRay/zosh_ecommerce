import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Box, Button, CircularProgress, IconButton, TableFooter, TablePagination, TextField } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { fetchAllProductsAdmin, deleteProduct } from '../../../Redux Toolkit/Admin/AdminProductSlice';
import { Search } from '@mui/icons-material';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';
import { useNavigate } from 'react-router-dom';

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

const ProductsTable = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { products = [], loading } = useAppSelector((state) => state.adminProducts);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAllProductsAdmin(localStorage.getItem('jwt') || ''));
  }, [dispatch]);

  const handleAddNewProduct = () => {
    navigate('/admin/add-product');
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct({ 
        id: productId, 
        jwt: localStorage.getItem('jwt') || '' 
      }));
    }
  };

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', justifyContent: 'space-between' }}>
        <TextField
          sx={{ width: 300 }}
          label="Search products"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: <Search />
          }}
        />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleAddNewProduct}
        >
          Add New Product
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="products table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Image</StyledTableCell>
              <StyledTableCell>Title</StyledTableCell>
              <StyledTableCell>MRP</StyledTableCell>
              <StyledTableCell>Selling Price</StyledTableCell>
              <StyledTableCell>Color</StyledTableCell>
              <StyledTableCell>Quantity</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && filteredProducts.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={7} align="center">
                  No products found
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              (rowsPerPage > 0
                ? filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : filteredProducts
              ).map((product) => (
                <StyledTableRow key={product.id}>
                  <StyledTableCell>
                    {product.images && product.images.length > 0 && (
                      <img 
                        src={product.images[0]} 
                        alt={product.title}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    )}
                  </StyledTableCell>
                  <StyledTableCell>{product.title}</StyledTableCell>
                  <StyledTableCell>₹{product.mrpPrice}</StyledTableCell>
                  <StyledTableCell>₹{product.sellingPrice}</StyledTableCell>
                  <StyledTableCell>{product.color}</StyledTableCell>
                  <StyledTableCell>{product.quantity}</StyledTableCell>
                  <StyledTableCell align="right">
                    <IconButton
                      onClick={() => handleDeleteProduct(product.id || 0)}
                      color="error"
                      size="small"
                    >
                      <DeleteOutlineIcon />
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
                colSpan={7}
                count={filteredProducts.length}
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

export default ProductsTable;