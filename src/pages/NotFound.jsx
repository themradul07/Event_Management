import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
            <h1 className="text-9xl font-extrabold text-purple-600 tracking-widest">404</h1>
            <div className="bg-purple-100 px-2 text-sm rounded rotate-12 absolute font-semibold text-purple-800">
                Page Not Found
            </div>
            <p className="text-gray-600 text-lg mt-8 mb-6 max-w-md">
                Sorry, the page you are looking for doesn&apos;t exist or has been moved.
            </p>
            <Link
                to="/"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl shadow-md transition duration-200"
            >
                Back to Home
            </Link>
        </div>
    );
};

export default NotFound;
