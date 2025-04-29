import React, { useEffect } from 'react'
import Navbar from '../../../admin seller/components/navbar/Navbar'
import AdminDrawerList from '../../components/DrawerList'
import { useAppDispatch } from '../../../Redux Toolkit/Store'
import { fetchSellers } from '../../../Redux Toolkit/Seller/sellerSlice'
import { fetchAllCustomers } from '../../../Redux Toolkit/Admin/AdminCustomerSlice'
import { fetchAllProductsAdmin } from '../../../Redux Toolkit/Admin/AdminProductSlice'
import { Outlet } from 'react-router-dom'

const AdminDashboard = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Fetch initial data when dashboard loads
    const jwt = localStorage.getItem("jwt") || "";
    dispatch(fetchSellers('ACTIVE'));
    dispatch(fetchAllCustomers(jwt));
    dispatch(fetchAllProductsAdmin(jwt));
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      <Navbar DrawerList={AdminDrawerList} />
      <section className="lg:flex lg:h-[90vh]">
        <div className="hidden lg:block h-full">
          <AdminDrawerList />
        </div>
        <div className="p-10 w-full lg:w-[80%] overflow-y-auto">
          <Outlet />
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard