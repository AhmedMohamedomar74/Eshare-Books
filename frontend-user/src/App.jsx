import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookDetails from "./pages/Book-Details/BookDetails";
import Navbar from "./components/Navbar";

function App() {
  return (
    // <BrowserRouter>
    //   <Navbar />
    //   <Routes>
    //     <Route path="/details/:id" element={<BookDetails />} />
    //   </Routes>
    // </BrowserRouter>

    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Hello Tailwind CSS!
      </h1>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Tailwind Button
      </button>
    </div>
  );
}

export default App;
