'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-md border border-[#DDA853] border-opacity-20">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#183B4E]">
            Sign in to Musis
          </h2>
          <p className="mt-2 text-center text-sm text-[#27548A]">
            Or{' '}
            <Link href="/signup" className="font-medium text-[#27548A] hover:text-[#183B4E] transition-all duration-200">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#DDA853] border-opacity-20 placeholder-[#27548A] placeholder-opacity-50 text-[#183B4E] rounded-t-md focus:outline-none focus:ring-[#27548A] focus:border-[#27548A] focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#DDA853] border-opacity-20 placeholder-[#27548A] placeholder-opacity-50 text-[#183B4E] rounded-b-md focus:outline-none focus:ring-[#27548A] focus:border-[#27548A] focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#F5EEDC] bg-[#27548A] hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#27548A] transition-all duration-200"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#DDA853] border-opacity-20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#27548A]">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => signIn('github', { callbackUrl: '/' })}
              className="w-full inline-flex justify-center py-2 px-4 border border-[#DDA853] border-opacity-20 rounded-md shadow-sm bg-white text-sm font-medium text-[#183B4E] hover:bg-[#F5EEDC] hover:bg-opacity-30 transition-all duration-200"
            >
              GitHub
            </button>
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="w-full inline-flex justify-center py-2 px-4 border border-[#DDA853] border-opacity-20 rounded-md shadow-sm bg-white text-sm font-medium text-[#183B4E] hover:bg-[#F5EEDC] hover:bg-opacity-30 transition-all duration-200"
            >
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 