
'use client';

import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import { Category } from '../types';
import { CategoryDestinationsModal } from './CategoryDestinationsModal';

interface CategoryGridProps {
  onRequireAuth?: () => void;
  onOpenMyTrips?: () => void;
}

interface CategoryCardProps {
  category: Category;
  onClick: (category: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  // Skip the primary one as it has its own banner
  if (category.isPrimary) return null;

  return (
    <div 
      onClick={() => onClick(category)}
      className="group bg-white rounded-xl md:rounded-2xl p-3 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-trawell-orange/20 cursor-pointer h-full flex flex-col"
    >
      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-3 transition-colors duration-300 ${
        category.id === 'romantic' ? 'bg-pink-100 text-pink-500' :
        category.id === 'adventure' ? 'bg-orange-100 text-orange-500' :
        'bg-trawell-bg text-trawell-green'
      }`}>
        <category.icon className="w-4 h-4 md:w-5 md:h-5" />
      </div>
      <h3 className="text-xs md:text-lg font-bold text-gray-900 mb-0.5 group-hover:text-trawell-orange transition-colors">
        {category.title}
      </h3>
      <p className="text-gray-500 text-[10px] md:text-xs mt-auto line-clamp-2 md:line-clamp-none">
        {category.subtitle}
      </p>
    </div>
  );
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onRequireAuth, onOpenMyTrips }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  return (
    <section className="max-w-7xl mx-auto px-4">
      {/* 2 Cols on mobile, 3 on larger screens */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {CATEGORIES.map((cat) => (
          <CategoryCard 
            key={cat.id} 
            category={cat} 
            onClick={setSelectedCategory}
          />
        ))}
      </div>

      <CategoryDestinationsModal 
        isOpen={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
        category={selectedCategory}
        onRequireAuth={onRequireAuth}
        onOpenMyTrips={onOpenMyTrips}
      />
    </section>
  );
};
