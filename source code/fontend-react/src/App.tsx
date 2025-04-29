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
  const { adminAuth } = useAppSelector(state => state);
  const navigate = useNavigate();

  useEffect(() => {
    // If no admin token, redirect to admin login
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin-login");
      return;
    }

    // If not authenticated, redirect to admin login
    if (!adminAuth.isAuthenticated) {
      navigate("/admin-login");
      return;
    }
  }, [adminAuth.isAuthenticated, navigate]);

  // Show loading while checking authentication
  if (!adminAuth.isAuthenticated) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return <>{children}</>;
};

function App() {
  const dispatch = useAppDispatch()
  const { auth, sellerAuth, sellers } = useAppSelector(store => store)
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
          
          {/* Customer Routes */}
          <Route path='/*' element={<CustomerRoutes />} />
          <Route path='/become-seller' element={<BecomeSeller />} />
          <Route path='/account/verify' element={<SellerAccountVerification />} />
          <Route path='/account/verified' element={<SellerAccountVerified />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
