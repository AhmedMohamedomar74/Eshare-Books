import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookDetails from "./pages/Book-Details/BookDetails";
import Navbar from "./components/Navbar";
import BookCycleLogin from "./pages/login/BookCycleLogin.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/details/:id" element={<BookDetails />} />
        <Route path="/login" element={<BookCycleLogin/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
