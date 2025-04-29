import React, { useEffect, useState } from 'react'
import AdminLoginForm from './AdminLogin'
import { Alert, Snackbar } from '@mui/material';
import { useAppSelector } from '../../../Redux Toolkit/Store';

const AdminAuth = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { adminAuth } = useAppSelector(store => store);
  
  useEffect(() => {
    if (adminAuth.error || adminAuth.otpSent) {
      setSnackbarOpen(true);
    }
  }, [adminAuth.error, adminAuth.otpSent]);

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='max-w-4xl border rounded-md px-5 py-20'>
        <AdminLoginForm />
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={adminAuth.error ? "error" : "success"}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {adminAuth.error ? adminAuth.error : "OTP sent to your email"}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default AdminAuth