import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getMuiTheme } from "./theme/muiTheme";
import BookDetails from "./pages/Book-Details/BookDetails";
import BookCycleLogin from "./pages/login/Login.jsx";
import BookShareRegister from "./pages/register/Register.jsx";
import BookShareDashboard from "./pages/profile/Profile.jsx";
import MyReports from "./pages/MyReports/MyReports.jsx";
import OrderPage from "./pages/Order/OrderPage.jsx";
import Wishlist from "./pages/Wishlist/Wishlist.jsx";
import Report from "./pages/Report/Report.jsx";
import Home from "./pages/Home/Home.jsx";
import PublicProfile from "./pages/PublicProfile/PublicProfile.jsx";
import AddBook from "./pages/AddBook/AddBook.jsx";
import UserLayout from "./layout/UserLayout.jsx";
import ProtectedRoute from "./layout/ProtectedRoute.jsx";
import NavigationProvider from "./components/common/NavigationProvider.jsx";
import NotificationPage from "./pages/notification/NotificationPage.jsx";
import ForgotPassword from "./pages/forgetPassword/ForgotPassword.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import EditBook from "./pages/Edit Book/EditBook.jsx";
import PaymentSuccess from "./pages/payment-success/payment-success.jsx";
import VerifyEmail from "./pages/VerificationPage/VerifyEmail.jsx";
import { checkAuth } from "./redux/slices/authAction.js";
import { setNavigationCallback } from "./axiosInstance/axiosInstance.js";

function AppContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { direction } = useSelector((state) => state.lang);
  const { mode } = useSelector((state) => state.theme);
  const theme = getMuiTheme({ mode, direction });

  useEffect(() => {
    setNavigationCallback(navigate);

    // Check if user is already logged in
    dispatch(checkAuth());
  }, [dispatch, navigate]);

  return (
    <NavigationProvider>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/details/:id" element={<BookDetails />} />
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/public-profile/:userId" element={<PublicProfile />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/notification" element={<NotificationPage />} />
            <Route path="/profile" element={<BookShareDashboard />} />
            <Route path="/order/:id" element={<OrderPage />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/reports/:type/:targetId" element={<Report />} />
            <Route path="/myreports" element={<MyReports />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/edit-book/:id" element={<EditBook />} />
          </Route>
        </Route>

        <Route path="/login" element={<BookCycleLogin />} />
        <Route path="/forget-password" element={<ForgotPassword />} />
        <Route path="/register" element={<BookShareRegister />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </NavigationProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
