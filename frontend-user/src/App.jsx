import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookDetails from "./pages/Book-Details/BookDetails";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/details/:id" element={<BookDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
