import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Register = () => {
  const { register, handleSubmit } = useForm();
  const registerMutation = trpc.register.useMutation();
  const router = useRouter();

  // State for password visibility and error handling
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      const response = await registerMutation.mutateAsync(data);
      
       const { token } = response;

      router.push({
        pathname: '/validateEmail',
        query: { email: data.email,token }
      });
    } catch (error:any) {
      // Assuming error contains a message property or similar
      const errorMessage = error?.message || 'An error occurred during registration.';
      setError(errorMessage);
      setShowPopup(true);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    if (error === 'User already exists') {
      router.push('/login');
    }
  };

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-white-800 dark:border-black-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-black-900 md:text-2xl dark:text-black">
                Create your account
              </h1>
            </div>

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  placeholder="Your name"
                  className="bg-black-50 border border-black-300 text-black-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-black-700 dark:border-black-600 dark:placeholder-black-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="name@company.com"
                  className="bg-black-50 border border-black-300 text-black-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-black-700 dark:border-black-600 dark:placeholder-black-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-black-900 dark:text-black">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="••••••••"
                    className="bg-black-50 border border-black-300 text-black-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-black-700 dark:border-black-600 dark:placeholder-black-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5 text-black-500 dark:text-black-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10.9A9.968 9.968 0 0 1 12 4a9.968 9.968 0 0 1 9 6.9M12 4a9.968 9.968 0 0 1 9 6.9M3 10.9A9.968 9.968 0 0 1 12 20a9.968 9.968 0 0 1 9-6.9M3 10.9A9.968 9.968 0 0 1 12 4a9.968 9.968 0 0 1 9 6.9" />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-black-500 dark:text-black-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10.9A9.968 9.968 0 0 1 12 4a9.968 9.968 0 0 1 9 6.9M12 4a9.968 9.968 0 0 1 9 6.9M3 10.9A9.968 9.968 0 0 1 12 20a9.968 9.968 0 0 1 9-6.9M3 10.9A9.968 9.968 0 0 1 12 4a9.968 9.968 0 0 1 9 6.9" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-primary-800 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-800 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Create account
              </button>
              <p className="text-center text-sm font-light text-black-500 dark:text-black-400">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-800">
                  LOGIN
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-md">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={handlePopupClose}
              className="mt-2 px-4 py-2 text-black bg-blue-500 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Register;
