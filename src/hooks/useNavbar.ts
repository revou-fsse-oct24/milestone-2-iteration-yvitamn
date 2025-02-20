'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CategoryType } from '@/lib/types';
import { fetchCategories } from '@/lib/api'; 

export const useNavbar = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories(); 
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    loadCategories();
  }, []);

  const isActive = (path: string) => {
    return pathname === path ? "text-gray-300" : "hover:text-gray-300";
  };

  return { categories, isActive };
};
