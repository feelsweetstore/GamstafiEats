import React from 'react';
import { PlusCircle } from 'lucide-react';

const RestaurantDashboard = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="text-center py-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Tableau de bord Restaurant
            </h2>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Ajouter des plats au menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;