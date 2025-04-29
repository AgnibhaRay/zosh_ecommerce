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
import { createHomeCategories } from './Redux Toolkit/Customer/Customer/AsyncThunk';
import { homeCategories } from './data/homeCategories';
import Mobile from './data/Products/mobile';
import SellerDashboard from './seller/pages/SellerDashboard/SellerDashboard';
import SellerAccountVerification from './seller/pages/SellerAccountVerification';
import SellerAccountVerified from './seller/pages/SellerAccountVerified';

// Protected Route Component for Admin
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppSelector(state => state.user);
  const isAdmin = user?.role === "ROLE_ADMIN";
  
  if (!localStorage.getItem("jwt")) {
    return <Navigate to="/admin-login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  const dispatch = useAppDispatch()
  const { auth, sellerAuth, sellers, user } = useAppSelector(store => store)
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      dispatch(fetchUserProfile({jwt:localStorage.getItem("jwt") || auth.jwt || "",navigate}));
      dispatch(fetchSellerProfile(localStorage.getItem("jwt") || sellerAuth.jwt))
    }
  }, [auth.jwt, sellerAuth.jwt])

  useEffect(() => {
    dispatch(createHomeCategories(homeCategories))
  }, [dispatch])

  return (
    <ThemeProvider theme={customeTheme}>
      <div className='App'>
        <Routes>
          {sellers.profile && <Route path='/seller/*' element={<SellerDashboard />} />}
          
          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminAuth />} />
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />

          <Route path='/verify-seller/:otp' element={<SellerAccountVerification />} />
          <Route path='/seller-account-verified' element={<SellerAccountVerified />} />
          <Route path='/become-seller' element={<BecomeSeller />} />
          <Route path='/dummy' element={<Mobile />} />
          <Route path='*' element={<CustomerRoutes />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
