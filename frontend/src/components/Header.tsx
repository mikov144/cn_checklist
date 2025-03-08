// src/components/Header.tsx

import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      {/* Title on the left */}
      <div className="text-xl font-bold text-gray-800">My App</div>

      {/* Navigation panel in the middle */}
      <nav className="flex space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-500">
          Home
        </Link>
        <Link to="/checklist" className="text-gray-700 hover:text-blue-500">
          Checklist
        </Link>
      </nav>

      {/* User name and logout button on the right */}
      <div className="flex items-center space-x-4">
        <span className="text-gray-700">Username</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;