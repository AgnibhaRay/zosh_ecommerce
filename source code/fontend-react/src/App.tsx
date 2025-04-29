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
  const { auth, user } = useAppSelector(state => ({
    auth: state.auth,
    user: state.user
  }));
  const navigate = useNavigate();

  useEffect(() => {
    // If no JWT token, redirect to login
    if (!localStorage.getItem("jwt")) {
      navigate("/admin-login");
      return;
    }

    // If user data is loaded and user is not admin, redirect to home
    if (user.user && user.user.role !== "ROLE_ADMIN") {
      navigate("/");
      return;
    }
  }, [user.user, navigate]);

  // Show loading while checking authentication
  if (!user.user) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  // Only render children if user is admin
  return user.user.role === "ROLE_ADMIN" ? <>{children}</> : null;
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
