import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SellersTable from '../admin/pages/sellers/SellersTable'
import CreateSellerForm from '../admin/pages/sellers/CreateSellerForm'
import CustomersTable from '../admin/pages/Customers/CustomersTable'
import CreateCustomerForm from '../admin/pages/Customers/CreateCustomerForm'
import ProductsTable from '../admin/pages/Products/ProductsTable'
import CreateProductForm from '../admin/pages/Products/CreateProductForm'
import Coupon from '../admin/pages/Coupon/Coupon'
import CouponForm from '../admin/pages/Coupon/CreateCouponForm'
import GridTable from '../admin/pages/Home Page/GridTable'
import ElectronicsTable from '../admin/pages/Home Page/ElectronicsTable'
import ShopByCategoryTable from '../admin/pages/Home Page/ShopByCategoryTable'
import Deal from '../admin/pages/Home Page/Deal'
import DashboardOverview from '../admin/pages/Dashboard/DashboardOverview'

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<DashboardOverview/>}/>
      <Route path='/add-seller' element={<CreateSellerForm/>}/>
      <Route path='/sellers' element={<SellersTable/>}/>
      <Route path='/customers' element={<CustomersTable/>}/>
      <Route path='/add-customer' element={<CreateCustomerForm/>}/>
      <Route path='/products' element={<ProductsTable/>}/>
      <Route path='/add-product' element={<CreateProductForm/>}/>
      <Route path='/coupon' element={<Coupon/>}/>
      <Route path='/add-coupon' element={<CouponForm/>}/>
      <Route path='/home-grid' element={<GridTable/>}/>
      <Route path='/electronics-category' element={<ElectronicsTable/>}/>
      <Route path='/shop-by-category' element={<ShopByCategoryTable/>}/>
      <Route path='/deals' element={<Deal/>}/>
    </Routes>
  )
}

export default AdminRoutes