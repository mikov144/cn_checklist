// src/components/Header.tsx

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ACCESS_TOKEN } from "../constants";
import { useUser } from "../context/UserContext";
import Modal from "./Modal";
import api from "../api";

function Header() {
  const navigate = useNavigate();
  const { user, loading, refreshUserData } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [presence, setPresence] = useState<{ online: number; total: number } | null>(null);
  const [now, setNow] = useState<Date>(new Date());
  const HEARTBEAT_INTERVAL_MS = 30000; // 30s
  const ONLINE_WINDOW_FALLBACK_MS = 60000; // should match backend

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) return;

      await refreshUserData();
    };

    initializeUser();
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const getOrCreateVisitorId = () => {
      const key = "visitor_id";
      let id = localStorage.getItem(key);
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(key, id);
      }
      return id;
    };

    const sendHeartbeat = async () => {
      try {
        const visitor_id = getOrCreateVisitorId();
        await api.post('/api/presence/heartbeat/', { visitor_id });
      } catch (e) {
        // silent fail
      }
    };

    const fetchStats = async () => {
      try {
        const { data } = await api.get('/api/presence/stats/');
        setPresence({ online: data.online, total: data.total });
      } catch (e) {
        // silent fail
      }
    };

    // initial kick
    sendHeartbeat();
    fetchStats();

    const heartbeatTimer = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS);
    const statsTimer = setInterval(fetchStats, Math.min(HEARTBEAT_INTERVAL_MS, ONLINE_WINDOW_FALLBACK_MS));

    return () => {
      clearInterval(heartbeatTimer);
      clearInterval(statsTimer);
    };
  }, []);

  const dayShort = now.toLocaleDateString(undefined, { weekday: 'short' });
  const time24 = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateDots = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const MobileMenu = () => (
    <Modal
      isOpen={isMobileMenuOpen}
      onClose={() => setIsMobileMenuOpen(false)}
      title=""
      showActions={false}
    >
      <div className="flex justify-center mb-6">
        <div className="text-synth-secondary neon-text text-xl">
          {presence ? (
            <span>
              Online: <span className="text-synth-primary">{presence.online}</span>
              <span className="mx-2 text-gray-500">|</span>
              Visited: <span className="text-synth-primary">{presence.total}</span>
            </span>
          ) : (
            <span>...</span>
          )}
        </div>
      </div>
      {!loading && (
        <>
          {user ? (
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-700">
              <Link 
                to="/profile" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 transform transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-500 shadow-lg 
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
                <span className="text-synth-secondary text-xl hover:text-synth-primary transition-colors duration-200">{user.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="button-retro py-2 px-4 rounded text-lg transform transition-all duration-200 hover:scale-110 active:scale-95"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex justify-center mb-8 pb-4 border-b border-gray-700">
              <button
                onClick={handleLogin}
                className="button-retro py-2 px-8 rounded text-lg transform transition-all duration-200 hover:scale-110 active:scale-95"
              >
                Login
              </button>
            </div>
          )}
        </>
      )}
      
      <div className="flex flex-col space-y-6">
        <Link 
          to="/" 
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-synth-secondary text-2xl font-retro neon-text text-center transform transition-all duration-200 
            hover:text-synth-primary hover:scale-110 active:scale-95"
        >
          Home
        </Link>
        <Link 
          to="/checklist" 
          onClick={() => setIsMobileMenuOpen(false)}
          className="text-synth-secondary text-2xl font-retro neon-text text-center transform transition-all duration-200 
            hover:text-synth-primary hover:scale-110 active:scale-95"
        >
          Checklist
        </Link>
      </div>
    </Modal>
  );

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

      {/* Navigation panel - visible only on desktop */}
      <nav className="hidden md:flex space-x-6">
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

      {/* User profile and auth button - visible only on desktop */}
      <div className="hidden md:flex items-center space-x-6">
        <div className="text-synth-secondary neon-text text-xl leading-tight text-right">
          <div>
            <span className="mr-2 text-synth-secondary/80">{dayShort}</span>
            <span className="highlight-text">{time24}</span>
          </div>
          <div className="text-synth-secondary/80">{dateDots}</div>
        </div>
        <div className="text-synth-secondary neon-text text-xl">
          {presence ? (
            <span>
              Online: <span className="text-synth-primary">{presence.online}</span>
              <span className="mx-2 text-gray-500">|</span>
              Visited: <span className="text-synth-primary">{presence.total}</span>
            </span>
          ) : (
            <span>...</span>
          )}
        </div>
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
                  className="button-retro py-2 px-4 rounded text-lg cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="button-retro py-2 px-4 rounded cursor-pointer"
              >
                Login
              </button>
            )}
          </>
        )}
      </div>

      {/* Burger menu - visible only on mobile */}
      <button 
        className="md:hidden text-synth-secondary p-2 transform transition-all duration-200 
          hover:text-synth-primary hover:scale-110 active:scale-95"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Menu Modal */}
      <MobileMenu />
    </header>
  );
}

export default Header;