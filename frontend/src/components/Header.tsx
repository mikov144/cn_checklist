// src/components/Header.tsx

import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";
import { useUser } from "../context/UserContext";

function Header() {
  const navigate = useNavigate();
  const { user, loading, refreshUserData } = useUser();

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) return;

      await refreshUserData();
    };

    initializeUser();
  }, []); // Remove refreshUserData from dependencies to prevent re-runs

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header className="bg-synth-background p-4 flex items-center justify-between neon-border bg-gray-900/80">
      {/* Logo on the left */}
      <div className="text-2xl font-retro">
        <Link to="/" className="block transform transition-all duration-200 hover:scale-110 active:scale-95">
          <img 
            src="/images/_milkspace-logo.png" 
            alt="Milkspace Logo" 
            className="h-8 transition-all duration-200
              hover:filter hover:brightness-125 hover:drop-shadow-[0_0_8px_rgba(255,0,255,0.5)]
              active:filter active:brightness-90 active:drop-shadow-[0_0_4px_rgba(255,0,255,0.3)]"
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

      {/* User profile and auth button on the right */}
      <div className="flex items-center space-x-4">
        {!loading && (
          <>
            {user ? (
              <>
                <div className="flex items-center space-x-3">
                  <Link to="/profile" 
                    className="transform transition-all duration-200 hover:scale-110 active:scale-95 hover:rotate-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-500 shadow-lg 
                      transition-all duration-200 cursor-pointer
                      hover:border-synth-secondary hover:border-3
                      hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]
                      active:shadow-[0_0_8px_rgba(139,92,246,0.3)]
                      active:border-synth-primary">
                      <img 
                        src={user.profile.profile_picture || "/images/_default_pfp.jpg"}
                        alt={`${user.username}'s profile`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="button-retro py-2 px-4 rounded text-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="button-retro py-2 px-4 rounded"
              >
                Login
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
}

export default Header;