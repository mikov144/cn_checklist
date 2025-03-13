// src/components/Header.tsx

import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-synth-background p-4 flex items-center justify-between neon-border bg-gray-900/80">
      {/* Logo on the left */}
      <div className="text-2xl font-retro">
        <Link to="/">
          <img 
            src="/images/_milkspace-logo.png" 
            alt="Milkspace Logo" 
            className="h-8"  // Adjust height as needed
          />
        </Link>
      </div>

      {/* Navigation panel in the middle */}
      <nav className="flex space-x-6">
        <Link 
          to="/" 
          className="text-synth-secondary hover:text-synth-primary hover:scale-110 active:scale-95 transition-all duration-200 neon-text text-2xl"
        >
          Home
        </Link>
        <Link 
          to="/checklist" 
          className="text-synth-secondary hover:text-synth-primary hover:scale-110 active:scale-95 transition-all duration-200 neon-text text-2xl"
        >
          Checklist
        </Link>
      </nav>

      {/* User name and logout button on the right */}
      <div className="flex items-center space-x-4">
        <span className="text-synth-secondary neon-text">Username</span>
        <button
          onClick={handleLogout}
          className="button-retro py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;