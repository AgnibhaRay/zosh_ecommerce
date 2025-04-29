import React from 'react'
import Navbar from '../../../admin seller/components/navbar/Navbar'
import AdminDrawerList from '../../components/DrawerList'
import SellersTable from '../sellers/SellersTable'
import { useAppDispatch } from '../../../Redux Toolkit/Store'
import { fetchSellers } from '../../../Redux Toolkit/Seller/sellerSlice'

const AdminDashboard = () => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(fetchSellers('ACTIVE')); // Fetch sellers when dashboard loads
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
            <SellersTable />
          </div>
        </section>
      </div>
    </>
  )
}

export default AdminDashboard