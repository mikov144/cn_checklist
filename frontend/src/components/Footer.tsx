// src/components/Footer.tsx

function Footer() {
  return (
    <footer className="bg-gray-900/80 text-synth-secondary p-4 mt-auto">
      <div className="container mx-auto text-center space-y-2">
        <p className="text-md">
          App version: v1.0 | backend was done by using Django REST framework | frontend was done by using Vite + React + TypeScript | database - postgresql
        </p>
        <p className="text-md">
          coded by{' '}
          <a
            href="https://github.com/mikov144?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="text-synth-primary link-hover inline-block highlight-text"
          >
            Mikov
          </a>
          {' '}2025
        </p>
      </div>
    </footer>
  );
}

export default Footer; 