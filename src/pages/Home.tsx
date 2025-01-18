import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-violet-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Gamstafi Eats
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Une faim ressentie, un plat livré devant votre porte !
          </p>
          <SearchBar />
        </div>

        {!user && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
            >
              Commencer maintenant
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Se connecter
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;