import React from 'react'
import Navbar from '../../../admin seller/components/navbar/Navbar'
import AdminDrawerList from '../../components/DrawerList'
import AdminRoutes from '../../../routes/AdminRoutes'
import { useAppDispatch } from '../../../Redux Toolkit/Store'
import { fetchAllCustomers } from '../../../Redux Toolkit/Admin/AdminCustomerSlice'

const AdminDashboard = () => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    // Initialize customer data when dashboard loads
    dispatch(fetchAllCustomers(localStorage.getItem('jwt') || ''));
  }, [dispatch]);

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
    </>
  )
}

export default AdminDashboard