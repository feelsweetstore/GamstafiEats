import React from 'react';
import { Bike } from 'lucide-react';

const DriverDashboard = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <Bike className="h-16 w-16 text-gray-400 dark:text-gray-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucune livraison en cours
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Les nouvelles commandes apparaîtront ici.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;