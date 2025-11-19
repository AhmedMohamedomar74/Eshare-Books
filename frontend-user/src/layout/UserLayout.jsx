import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";


function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;