import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SellersTable from '../admin/pages/sellers/SellersTable'
import ProductsTable from '../admin/pages/Products/ProductsTable'

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<SellersTable/>}/>
      <Route path='/products' element={<ProductsTable/>}/>
    </Routes>
  )
}

export default AdminRoutes