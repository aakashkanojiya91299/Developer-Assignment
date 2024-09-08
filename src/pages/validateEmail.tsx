import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import axios from 'axios';

interface FormData {
  email: string;
  code: string;
}

const ValidateEmail = () => {
  const router = useRouter();
  const { email, token } = router.query;
  const {  handleSubmit, reset, setValue, getValues } = useForm<FormData>();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof email !== 'string' || typeof token !== 'string') {
      setMessage('Invalid parameters');
    }
  }, [email, token]);

  const handleCodeInput = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const code = getValues('code') || '';
    const updatedCode = code.split('');
    updatedCode[index] = value;
    setValue('code', updatedCode.join(''));
    if (value.length === 1 && event.target.nextSibling) {
      (event.target.nextSibling as HTMLInputElement).focus();
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      if (typeof email === 'string' && typeof token === 'string') {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/trpc/validateEmail`,
          { email:email, code: parseInt(data.code) },
          {
            headers: {
              'Authorization': `Bearer ${token}`, // Pass the token in the headers
              'Content-Type': 'application/json'
            }
          }
        );
        console.log(response.data.result.data.token)
        localStorage.setItem('token', response.data.result.data.token);
        router.push('/categories'); 
        setMessage(response.data.message);
      } else {
        setMessage('Invalid email or token');
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || error.message);
    } finally {
      reset();
    }
  };

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    if (localPart.length > 3) {
      return `${localPart.slice(0, 3)}***@${domain}`;
    }
    return email;
  };

  return (
    <section>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">
                Verify your email
              </h1>
              <p className="mt-2 text-lg text-gray-700">
                Enter the 8 digit code you have received on
              </p>
              <p className="mt-1 text-md text-gray-500">{maskEmail(typeof email === 'string' ? email : '')}</p>
            </div>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex justify-center space-x-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="w-10 h-10 text-center text-lg border border-gray-300 rounded-md focus:ring-primary-600 focus:border-primary-600 bg-white text-black"
                    onChange={(event) => handleCodeInput(index, event)}
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full text-white bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Submit
              </button>
            </form>

            {message && <p className="text-center text-sm text-red-500 mt-2">{message}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValidateEmail;
