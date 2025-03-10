// src/pages/Home.tsx

import Header from "../components/Header";

function Home() {
  return (
    <div className="min-h-screen bg-synth-background">
      <Header />
      <div className="flex flex-col items-center min-h-screen p-6">
        <h2 className="text-4xl font-retro neon-text text-synth-primary mb-6">
          Welcome to SynthWave
        </h2>
        <p className="text-synth-secondary neon-text">
          Dive into the retro-futuristic vibes of the 80s!
        </p>
      </div>
    </div>
  );
}

export default Home;