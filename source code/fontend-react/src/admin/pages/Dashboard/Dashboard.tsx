import React, { useEffect, useState } from 'react'
import AdminRoutes from '../../../routes/AdminRoutes'
import Navbar from '../../../admin seller/components/navbar/Navbar'
import AdminDrawerList from '../../components/DrawerList'
import { Alert, Snackbar } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store'
import { fetchAllCustomers } from '../../../Redux Toolkit/Admin/AdminCustomerSlice'
import { fetchAllProductsAdmin } from '../../../Redux Toolkit/Admin/AdminProductSlice'
import { fetchSellers } from '../../../Redux Toolkit/Seller/sellerSlice'

const AdminDashboard = () => {
  const { deal, admin } = useAppSelector(store => store)
  const dispatch = useAppDispatch();
  const [snackbarOpen, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  }

  useEffect(() => {
    // Fetch initial data when dashboard loads
    const jwt = localStorage.getItem("jwt") || "";
    dispatch(fetchAllCustomers(jwt));
    dispatch(fetchAllProductsAdmin(jwt));
    dispatch(fetchSellers("ACTIVE")); // Fetch active sellers
  }, [dispatch]);

  useEffect(() => {
    if (deal.dealCreated || deal.dealUpdated || deal.error || admin.categoryUpdated) {
      setOpenSnackbar(true)
    }
  }, [deal.dealCreated, deal.dealUpdated, deal.error, admin.categoryUpdated])
  
  return (
    <>
      <div className="min-h-screen">
        <Navbar DrawerList={AdminDrawerList} />
        <section className="lg:flex lg:h-[90vh]">
          <div className="hidden lg:block h-full">
            <AdminDrawerList />
          </div>
          <div className="p-10 w-full lg:w-[80%] overflow-y-auto">
            <AdminRoutes />
          </div>
        </section>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={deal.error ? "error" : "success"}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {deal.error ? deal.error : deal.dealCreated ? "Deal created successfully" : deal.dealUpdated ? "deal updated successfully" : admin.categoryUpdated ? "Category Updated successfully" : ""}
        </Alert>
      </Snackbar>
    </>
  )
}

export default AdminDashboard