// src/pages/NotFound.tsx

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Not Found</h2>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist!</p>
        <a href="/" className="text-blue-500 hover:text-blue-700">
          Go back to Home
        </a>
      </div>
    </div>
  );
}

export default NotFound;