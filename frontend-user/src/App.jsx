import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookDetails from "./pages/Book-Details/BookDetails";
import Navbar from "./components/Navbar";
import BookCycleLogin from "./pages/login/Login.jsx";
import BookShareRegister from "./pages/register/Register.jsx";
import BookShareDashboard from "./pages/profile/Profile.jsx";
import MyReports from "./pages/MyReports/MyReports.jsx";
import OrderPage from "./pages/Order/OrderPage.jsx";
import Wishlist from "./pages/Wishlist/Wishlist.jsx";
import Report from "./pages/Report/Report.jsx";
import Home from "./pages/Home/Home.jsx";
import AddBook from "./pages/AddBook/AddBook.jsx";
import UserLayout from "./layout/UserLayout.jsx";
import ProtectedRoute from "./layout/ProtectedRoute.jsx";
import NavigationProvider from "./components/common/NavigationProvider.jsx";
function App() {
  return (
    <BrowserRouter>
    <NavigationProvider>
      {/* <Navbar /> */}
      <Routes>
        {/* <Route path="/" element={<Home />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/details/:id" element={<BookDetails />} />
        <Route path="/login" element={<BookCycleLogin />} />
        <Route path="/register" element={<BookShareRegister />} />
        <Route path="/profile" element={<BookShareDashboard />} />
        <Route path="/order/:id" element={<OrderPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/reports/:type/:targetId" element={<Report />} />
        <Route path="/myreports" element={<MyReports />} /> */}
        <Route element={<UserLayout />}>
          <Route path="/details/:id" element={<BookDetails />} />
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<BookShareDashboard />} />
            <Route path="/order/:id" element={<OrderPage />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/reports/:type/:targetId" element={<Report />} />
            <Route path="/myreports" element={<MyReports />} />
            <Route path="/add-book" element={<AddBook />} />
          </Route>
        </Route>
        <Route path="/login" element={<BookCycleLogin />} />
        <Route path="/register" element={<BookShareRegister />} />
      </Routes>
      </NavigationProvider>
    </BrowserRouter>
  );
}

export default App;
