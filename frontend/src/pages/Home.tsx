// src/pages/Home.tsx

import Header from "../components/Header";

function Home() {
  return (
    <div className="font-sans min-h-screen bg-gray-100">
      <Header />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800">Welcome</h2>
      </div>
    </div>
  );
}

export default Home;