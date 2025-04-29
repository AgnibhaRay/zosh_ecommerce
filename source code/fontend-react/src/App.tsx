import './App.css';
import { ThemeProvider } from '@emotion/react';
import customeTheme from './Theme/customeTheme';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import CustomerRoutes from './routes/CustomerRoutes';
import AdminDashboard from './admin/pages/Dashboard/Dashboard';
import { useAppDispatch, useAppSelector } from './Redux Toolkit/Store';
import { useEffect } from 'react';
import { fetchSellerProfile } from './Redux Toolkit/Seller/sellerSlice';
import BecomeSeller from './customer/pages/BecomeSeller/BecomeSeller';
import AdminAuth from './admin/pages/Auth/AdminAuth';
import { fetchUserProfile } from './Redux Toolkit/Customer/UserSlice';
import SellerDashboard from './seller/pages/SellerDashboard/SellerDashboard';
import SellerAccountVerification from './seller/pages/SellerAccountVerification';
import SellerAccountVerified from './seller/pages/SellerAccountVerified';
import DashboardOverview from './admin/pages/Dashboard/DashboardOverview';
import SellersTable from './admin/pages/sellers/SellersTable';
import CustomersTable from './admin/pages/Customers/CustomersTable';
import CreateCustomerForm from './admin/pages/Customers/CreateCustomerForm';
import ProductsTable from './admin/pages/Products/ProductsTable';
import CreateProductForm from './admin/pages/Products/CreateProductForm';
import Coupon from './admin/pages/Coupon/Coupon';
import CouponForm from './admin/pages/Coupon/CreateCouponForm';
import GridTable from './admin/pages/Home Page/GridTable';
import ElectronicsTable from './admin/pages/Home Page/ElectronicsTable';
import ShopByCategoryTable from './admin/pages/Home Page/ShopByCategoryTable';
import Deal from './admin/pages/Home Page/Deal';
import CreateSellerForm from './admin/pages/sellers/CreateSellerForm';

// Protected Route Component for Admin
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { auth, user } = useAppSelector(state => ({
    auth: state.auth,
    user: state.user
  }));
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("jwt")) {
      navigate("/admin-login");
      return;
    }

    if (user.user && user.user.role !== "ROLE_ADMIN") {
      navigate("/");
      return;
    }
  }, [user.user, navigate]);

  if (!user.user) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return user.user.role === "ROLE_ADMIN" ? <>{children}</> : null;
};

function App() {
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector((store) => store);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      dispatch(fetchUserProfile({ jwt: localStorage.getItem("jwt") || "", navigate }));
    }
  }, [auth.jwt, navigate]);

  return (
    <ThemeProvider theme={customeTheme}>
      <div className="">
        <Routes>
          <Route path="/*" element={<CustomerRoutes />} />
          <Route path="/become-seller" element={<BecomeSeller />} />
          <Route path="/seller/verify/:id" element={<SellerAccountVerification />} />
          <Route path="/seller/verified/:id" element={<SellerAccountVerified />} />
          <Route path="/seller/*" element={<SellerDashboard />} />
          <Route path="/admin-login" element={<AdminAuth />} />
          
          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="sellers" element={<SellersTable />} />
            <Route path="add-seller" element={<CreateSellerForm />} />
            <Route path="customers" element={<CustomersTable />} />
            <Route path="add-customer" element={<CreateCustomerForm />} />
            <Route path="products" element={<ProductsTable />} />
            <Route path="add-product" element={<CreateProductForm />} />
            <Route path="coupon" element={<Coupon />} />
            <Route path="add-coupon" element={<CouponForm />} />
            <Route path="home-grid" element={<GridTable />} />
            <Route path="electronics-category" element={<ElectronicsTable />} />
            <Route path="shop-by-category" element={<ShopByCategoryTable />} />
            <Route path="deals" element={<Deal />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
