import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Utensils, 
  User, 
  LogIn, 
  ShoppingCart, 
  ClipboardList,
  Bell
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = React.useState(0);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Utensils className="h-8 w-8 text-violet-600 dark:text-violet-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Gamstafi Eats</span>
            </Link>
          </div>

          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/orders"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400"
              >
                <ClipboardList className="h-5 w-5 mr-2" />
                Commandes
              </Link>
              
              <Link
                to="/cart"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Panier
              </Link>

              <button
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400"
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => signOut()}
                  className="hidden md:block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  Déconnexion
                </button>
                <Link
                  to="/profile"
                  className="inline-flex items-center justify-center p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  <User className="h-5 w-5" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;