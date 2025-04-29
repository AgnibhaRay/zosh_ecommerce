import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Grid, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { createProduct, fetchAllProductsAdmin } from '../../../Redux Toolkit/Admin/AdminProductSlice';

interface ProductFormValues {
  title: string;
  description: string;
  mrpPrice: number;
  sellingPrice: number;
  quantity: number;
  color: string;
  images: string;
  sizes: string;
}

const CreateProductForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, productCreated } = useAppSelector((state) => state.adminProducts);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const formik = useFormik<ProductFormValues>({
    initialValues: {
      title: '',
      description: '',
      mrpPrice: 0,
      sellingPrice: 0,
      quantity: 0,
      color: '',
      images: '',
      sizes: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      mrpPrice: Yup.number().required('MRP is required').min(0, 'Must be non-negative'),
      sellingPrice: Yup.number().required('Selling price is required').min(0, 'Must be non-negative'),
      quantity: Yup.number().required('Quantity is required').min(0, 'Must be non-negative'),
      color: Yup.string().required('Color is required'),
    }),
    onSubmit: (values) => {
      const payload = {
        ...values,
        images: values.images.split(',').map((s) => s.trim()),
        sizes: values.sizes.split(',').map((s) => s.trim()),
      };
      dispatch(createProduct({ product: payload, jwt: localStorage.getItem('jwt') || '' }));
    },
  });

  useEffect(() => {
    if (productCreated) {
      setSnackbarOpen(true);
      formik.resetForm();
      dispatch(fetchAllProductsAdmin(localStorage.getItem('jwt') || ''));
    }
  }, [productCreated]);

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3, maxWidth: 600 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="title"
            name="title"
            label="Title"
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="description"
            name="description"
            label="Description"
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description && formik.errors.description}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="mrpPrice"
            name="mrpPrice"
            label="MRP Price"
            type="number"
            value={formik.values.mrpPrice}
            onChange={formik.handleChange}
            error={formik.touched.mrpPrice && Boolean(formik.errors.mrpPrice)}
            helperText={formik.touched.mrpPrice && formik.errors.mrpPrice}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="sellingPrice"
            name="sellingPrice"
            label="Selling Price"
            type="number"
            value={formik.values.sellingPrice}
            onChange={formik.handleChange}
            error={formik.touched.sellingPrice && Boolean(formik.errors.sellingPrice)}
            helperText={formik.touched.sellingPrice && formik.errors.sellingPrice}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="quantity"
            name="quantity"
            label="Quantity"
            type="number"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
            helperText={formik.touched.quantity && formik.errors.quantity}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="color"
            name="color"
            label="Color"
            value={formik.values.color}
            onChange={formik.handleChange}
            error={formik.touched.color && Boolean(formik.errors.color)}
            helperText={formik.touched.color && formik.errors.color}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="images"
            name="images"
            label="Images (comma separated URLs)"
            value={formik.values.images}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="sizes"
            name="sizes"
            label="Sizes (comma separated)"
            value={formik.values.sizes}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button color="primary" variant="contained" fullWidth type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Create Product'}
          </Button>
        </Grid>
      </Grid>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
          {error || 'Product created successfully'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateProductForm;