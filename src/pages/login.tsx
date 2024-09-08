import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {jwtDecode} from 'jwt-decode';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = trpc.login.useMutation();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      alert('Please fill in both fields');
      return;
    }

    try {
      // Call the mutation with email and password
      const response = await loginMutation.mutateAsync({ email, password });

      // Decode the JWT token
      const decodedToken: any = jwtDecode(response.token);

      // Check if user is verified
      if (decodedToken.isVerified) {
        // Store token and redirect to category page
        localStorage.setItem('token', response.token);
        router.push('/categories'); // Redirect to the category page
      } else {
        // Redirect to email verification page with query parameters
        router.push({
          pathname: '/validateEmail',
          query: {
            email: email, // Pass the email
            token: response.token // Pass the token
          }
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  useEffect(() => {
    // Check if a token exists in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Decode the JWT token
      const decodedToken: any = jwtDecode(token);

      // Redirect based on token verification status
      if (decodedToken.isVerified) {
        router.push('/categories'); // Redirect to the category page
      } else {
        router.push({
          pathname: '/validateEmail',
          query: {
            email: decodedToken.email, // Pass the email from token
            token: token // Pass the token
          }
        });
      }
    }
  }, [router]);

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-black-800 dark:border-black-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-black-900 md:text-2xl dark:text-black">
                Login
              </h1>
              <h2 className="mt-2 text-lg text-black-600 dark:text-black-400">
                Welcome back to ECOMMERCE
              </h2>
              <h5 className="mt-1 text-sm text-black-500 dark:text-black-300">
                The next gen business marketplace
              </h5>
            </div>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-black-900 dark:text-white">Your email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="bg-black-50 border border-black-300 text-black-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-black-700 dark:border-black-600 dark:placeholder-black-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-black-900 dark:text-white">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-black-50 border border-black-300 text-black-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-black-700 dark:border-black-600 dark:placeholder-black-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-primary-800 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-800 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                LOGIN
              </button>
              <p className="text-center text-sm font-light text-black-500 dark:text-black-400">
                Don’t have an account yet? <Link href="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-800">SIGN UP</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
