import React from 'react';
import { Search } from 'lucide-react';

export const SearchBar = () => {
  return (
    <div className="relative max-w-2xl mx-auto w-full">
      <input
        type="text"
        placeholder="Rechercher des restaurants et des plats..."
        className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent outline-none transition-all"
      />
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
    </div>
  );
};