import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookDetails from './pages/Book-Details/BookDetails';
import Navbar from './components/Navbar';
import Wishlist from './pages/Wishlist/Wishlist';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/details/:id" element={<BookDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
