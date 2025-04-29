import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Grid, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { createCustomer, fetchAllCustomers } from '../../../Redux Toolkit/Admin/AdminCustomerSlice';

const CreateCustomerForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, customerCreated } = useAppSelector((state) => state.adminCustomers);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      mobile: '',
      password: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required('Full name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      mobile: Yup.string().required('Mobile is required'),
      password: Yup.string().min(6, 'Password too short').required('Password is required'),
    }),
    onSubmit: (values) => {
      dispatch(createCustomer({ customer: values, jwt: localStorage.getItem('jwt') || '' }));
    },
  });

  useEffect(() => {
    if (customerCreated) {
      setSnackbarOpen(true);
      formik.resetForm();
      dispatch(fetchAllCustomers(localStorage.getItem('jwt') || ''));
    }
  }, [customerCreated]);

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3, maxWidth: 600 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="fullName"
            name="fullName"
            label="Full Name"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="mobile"
            name="mobile"
            label="Mobile"
            value={formik.values.mobile}
            onChange={formik.handleChange}
            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
            helperText={formik.touched.mobile && formik.errors.mobile}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="password"
            id="password"
            name="password"
            label="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Customer'}
          </Button>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || 'Customer created successfully'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateCustomerForm;