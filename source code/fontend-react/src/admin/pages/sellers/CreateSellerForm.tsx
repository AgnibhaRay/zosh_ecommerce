import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Grid, Box, Snackbar, Alert, CircularProgress, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { createSeller, fetchSellers } from '../../../Redux Toolkit/Seller/sellerSlice';

const CreateSellerForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, sellerCreated } = useAppSelector((state) => state.sellers);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      sellerName: '',
      email: '',
      mobile: '',
      password: '',
      gstin: '',
      otp: '',
      businessDetails: { 
        businessName: '' 
      },
      pickupAddress: {
        name: '',
        mobile: '',
        pincode: '',
        address: '',
        locality: '',
        city: '',
        state: ''
      },
      bankDetails: {
        accountNumber: '',
        ifscCode: '',
        accountHolderName: ''
      }
    },
    validationSchema: Yup.object({
      sellerName: Yup.string().required('Seller name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      mobile: Yup.string().required('Mobile is required'),
      password: Yup.string().min(6, 'Password too short').required('Password is required'),
      gstin: Yup.string().required('GSTIN is required'),
      otp: Yup.string(),
      businessDetails: Yup.object({
        businessName: Yup.string().required('Business name is required')
      }),
      pickupAddress: Yup.object({
        name: Yup.string(),
        mobile: Yup.string(),
        pincode: Yup.string(),
        address: Yup.string(),
        locality: Yup.string(),
        city: Yup.string(),
        state: Yup.string()
      }),
      bankDetails: Yup.object({
        accountNumber: Yup.string(),
        ifscCode: Yup.string(),
        accountHolderName: Yup.string()
      })
    }),
    onSubmit: (values) => {
      console.log('Form values being submitted:', values);
      console.log('JWT being used:', localStorage.getItem('jwt'));
      dispatch(createSeller({ seller: values, jwt: localStorage.getItem('jwt') || '' }));
    },
  });

  useEffect(() => {
    if (sellerCreated) {
      setSnackbarOpen(true);
      dispatch(fetchSellers('ACTIVE'));
      formik.resetForm();
    }
  }, [sellerCreated, dispatch, formik]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3, maxWidth: 600 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id="sellerName"
            name="sellerName"
            label="Seller Name"
            value={formik.values.sellerName}
            onChange={formik.handleChange}
            error={formik.touched.sellerName && Boolean(formik.errors.sellerName)}
            helperText={formik.touched.sellerName && formik.errors.sellerName}
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
            id="gstin"
            name="gstin"
            label="GSTIN"
            value={formik.values.gstin}
            onChange={formik.handleChange}
            error={formik.touched.gstin && Boolean(formik.errors.gstin)}
            helperText={formik.touched.gstin && formik.errors.gstin}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="businessDetails.businessName"
            name="businessDetails.businessName"
            label="Business Name"
            value={formik.values.businessDetails.businessName}
            onChange={formik.handleChange}
            error={
              formik.touched.businessDetails?.businessName &&
              Boolean(formik.errors.businessDetails?.businessName)
            }
            helperText={
              formik.touched.businessDetails?.businessName &&
              formik.errors.businessDetails?.businessName
            }
          />
        </Grid>
        <Grid item xs={12}>
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
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Pickup Address</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="pickupAddress.name"
                name="pickupAddress.name"
                label="Name"
                value={formik.values.pickupAddress.name}
                onChange={formik.handleChange}
                error={formik.touched.pickupAddress?.name && Boolean(formik.errors.pickupAddress?.name)}
                helperText={formik.touched.pickupAddress?.name && formik.errors.pickupAddress?.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="pickupAddress.mobile"
                name="pickupAddress.mobile"
                label="Mobile"
                value={formik.values.pickupAddress.mobile}
                onChange={formik.handleChange}
                error={formik.touched.pickupAddress?.mobile && Boolean(formik.errors.pickupAddress?.mobile)}
                helperText={formik.touched.pickupAddress?.mobile && formik.errors.pickupAddress?.mobile}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="pickupAddress.address"
                name="pickupAddress.address"
                label="Address"
                value={formik.values.pickupAddress.address}
                onChange={formik.handleChange}
                error={formik.touched.pickupAddress?.address && Boolean(formik.errors.pickupAddress?.address)}
                helperText={formik.touched.pickupAddress?.address && formik.errors.pickupAddress?.address}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="pickupAddress.locality"
                name="pickupAddress.locality"
                label="Locality"
                value={formik.values.pickupAddress.locality}
                onChange={formik.handleChange}
                error={formik.touched.pickupAddress?.locality && Boolean(formik.errors.pickupAddress?.locality)}
                helperText={formik.touched.pickupAddress?.locality && formik.errors.pickupAddress?.locality}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="pickupAddress.pincode"
                name="pickupAddress.pincode"
                label="Pincode"
                value={formik.values.pickupAddress.pincode}
                onChange={formik.handleChange}
                error={formik.touched.pickupAddress?.pincode && Boolean(formik.errors.pickupAddress?.pincode)}
                helperText={formik.touched.pickupAddress?.pincode && formik.errors.pickupAddress?.pincode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="pickupAddress.city"
                name="pickupAddress.city"
                label="City"
                value={formik.values.pickupAddress.city}
                onChange={formik.handleChange}
                error={formik.touched.pickupAddress?.city && Boolean(formik.errors.pickupAddress?.city)}
                helperText={formik.touched.pickupAddress?.city && formik.errors.pickupAddress?.city}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="pickupAddress.state"
                name="pickupAddress.state"
                label="State"
                value={formik.values.pickupAddress.state}
                onChange={formik.handleChange}
                error={formik.touched.pickupAddress?.state && Boolean(formik.errors.pickupAddress?.state)}
                helperText={formik.touched.pickupAddress?.state && formik.errors.pickupAddress?.state}
              />
            </Grid>
          </Grid>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Bank Details</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="bankDetails.accountHolderName"
                name="bankDetails.accountHolderName"
                label="Account Holder Name"
                value={formik.values.bankDetails.accountHolderName}
                onChange={formik.handleChange}
                error={formik.touched.bankDetails?.accountHolderName && Boolean(formik.errors.bankDetails?.accountHolderName)}
                helperText={formik.touched.bankDetails?.accountHolderName && formik.errors.bankDetails?.accountHolderName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="bankDetails.accountNumber"
                name="bankDetails.accountNumber"
                label="Account Number"
                value={formik.values.bankDetails.accountNumber}
                onChange={formik.handleChange}
                error={formik.touched.bankDetails?.accountNumber && Boolean(formik.errors.bankDetails?.accountNumber)}
                helperText={formik.touched.bankDetails?.accountNumber && formik.errors.bankDetails?.accountNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="bankDetails.ifscCode"
                name="bankDetails.ifscCode"
                label="IFSC Code"
                value={formik.values.bankDetails.ifscCode}
                onChange={formik.handleChange}
                error={formik.touched.bankDetails?.ifscCode && Boolean(formik.errors.bankDetails?.ifscCode)}
                helperText={formik.touched.bankDetails?.ifscCode && formik.errors.bankDetails?.ifscCode}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button color="primary" variant="contained" fullWidth type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Create Seller'}
          </Button>
        </Grid>
      </Grid>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'} variant="filled" sx={{ width: '100%' }}>
          {error || 'Seller created successfully'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateSellerForm;