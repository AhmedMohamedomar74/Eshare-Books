import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookDetails from "./pages/Book-Details/BookDetails";
import Navbar from "./components/Navbar";
import BookCycleLogin from "./pages/login/Login.jsx";
import BookShareRegister from "./pages/register/Register.jsx";
import BookShareDashboard from "./pages/profile/Profile.jsx";

import OrderPage from "./pages/Order/OrderPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/details/:id" element={<BookDetails />} />
        <Route path="/login" element={<BookCycleLogin/>} />
        <Route path="/register" element={<BookShareRegister/>} />
        <Route path="/profile" element={<BookShareDashboard/>} />
        <Route path="/order" element={<OrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
