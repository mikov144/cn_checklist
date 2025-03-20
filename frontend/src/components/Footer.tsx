// src/components/Footer.tsx

function Footer() {
  return (
    <footer>
      <div className="container mx-auto py-4 px-6">
        <div className="flex flex-col items-center space-y-3">
          {/* Tech stack info */}
          <div className="flex flex-wrap justify-center items-center gap-2 text-md font-medium text-white/90">
            <span className="text-cyan-300 font-bold neon-text">v0.98</span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="text-cyan-300 font-bold neon-text">Django REST framework</span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="text-cyan-300 font-bold neon-text">Vite + React + TypeScript</span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="text-cyan-300 font-bold neon-text">Postgresql</span>
          </div>

          {/* Author info */}
          <div className="text-md flex items-center space-x-2 text-white/90 font-medium">
            <span>coded by</span>
            <a
              href="https://github.com/mikov144?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 font-retro font-bold transition-all duration-300 neon-text
                hover:text-cyan-400 hover:scale-110
                active:scale-95"
            >
              Mikov
            </a>
            <span className="text-white/70">2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 