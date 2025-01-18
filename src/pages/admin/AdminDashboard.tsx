import React from 'react';
import { Users, ShoppingCart, BarChart2 } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Tableau de bord Administrateur
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gestion des utilisateurs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Gestion des utilisateurs
              </h2>
              <Users className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Gérez les comptes clients, restaurants et livreurs
            </p>
          </div>

          {/* Gestion des commandes */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Gestion des commandes
              </h2>
              <ShoppingCart className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Suivez et gérez toutes les commandes
            </p>
          </div>

          {/* Statistiques */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Statistiques
              </h2>
              <BarChart2 className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Visualisez les performances de la plateforme
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;