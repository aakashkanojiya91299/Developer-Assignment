import Link from 'next/link';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome to Our Platform</h1>
      <p className="text-lg text-gray-700 mb-6">We're glad to have you here. Please choose an option below to get started.</p>
      <div className="space-x-4">
        <Link href="/login">
          <p className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105">
            Login
          </p>
        </Link>
        <Link href="/register">
          <p className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105">
            Register
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
