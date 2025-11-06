import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookDetails from "./pages/Book-Details/BookDetails";
import Navbar from "./components/Navbar";
import BookCycleLogin from "./pages/login/Login.jsx";
import BookShareRegister from "./pages/register/Register.jsx";
import Home from "./pages/Home/Home.jsx";
import AddBook from "./pages/AddBook/AddBook.jsx";

import OrderPage from "./pages/Order/OrderPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/details/:id" element={<BookDetails />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/login" element={<BookCycleLogin />} />
        <Route path="/register" element={<BookShareRegister />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
