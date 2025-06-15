import React from 'react';
import { Link } from '@inertiajs/react';

const Home = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 px-4">
            <div className="text-center bg-white p-8 sm:p-10 md:p-12 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-lg">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 mb-8 leading-snug">
                    Welcome to <span className="text-blue-600">AI Enhanced Note Editor</span>
                </h1>

                <div className="space-y-4">
                    <a
                        href="/auth/google/redirect"
                        className="block w-full py-2 px-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-300"
                    >
                        Login with Google
                    </a>

                    <Link
                        href="/login"
                        className="block w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                    >
                        Login
                    </Link>

                    <Link
                        href="/register"
                        className="block w-full py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition duration-300"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
