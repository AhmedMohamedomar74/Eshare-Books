import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookDetails from "./pages/Book-Details/BookDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/details/:id" element={<BookDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
