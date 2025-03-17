// src/components/Footer.tsx

function Footer() {
  return (
    <footer className="bg-gray-900/90 text-synth-secondary border-t border-synth-primary/30 backdrop-blur-sm neon-border">
      <div className="container mx-auto py-4 px-6">
        <div className="flex flex-col items-center space-y-3">
          {/* Tech stack info */}
          <div className="flex flex-wrap justify-center items-center gap-2 text-md">
            <span className="text-synth-primary font-semibold">v0.98</span>
            <span className="hidden sm:inline text-synth-secondary/50">|</span>
            <span>backend was done by using <span className="text-synth-primary highlight-text">Django REST framework</span></span>
            <span className="hidden sm:inline text-synth-secondary/50">|</span>
            <span>frontend was done by using <span className="text-synth-primary highlight-text">Vite + React + TypeScript</span></span>
            <span className="hidden sm:inline text-synth-secondary/50">|</span>
            <span>database - <span className="text-synth-primary highlight-text">postgresql</span></span>
          </div>

          {/* Author info */}
          <div className="text-md flex items-center space-x-2">
            <span>coded by</span>
            <a
              href="https://github.com/mikov144?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="text-synth-primary font-retro transition-all duration-300
                hover:text-pink-500 hover:scale-110
                active:scale-95 active:shadow-[0_0_1px_rgba(255,0,255,0.3)]"
            >
              Mikov
            </a>
            <span className="text-synth-secondary/80">2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 