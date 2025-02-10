import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Category } from '@/lib/types';

interface NavbarProps {
  categories: Category[]; // Add categories prop
  onCategoryChange: (categoryId: string) => void; // Add callback for category selection
}

const Navbar: React.FC<NavbarProps> = ({ categories, onCategoryChange }) => {
  const { isAuthenticated, user, logout } = useAuth(); // Access user and authentication state
  const pathname = usePathname(); // To track the current route
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility
  const dropdownRef = useRef<HTMLDivElement>(null);  // Create a ref for the dropdown
  
  const handleLogout = () => {
    logout(); // Call the logout function from context
    // You can also clear local storage or token if you're saving it
    localStorage.removeItem('token');
  };

  // Check if the current route is active
  const isActive = (path: string) => pathname === path;

  // Handle category selection and redirect to the category page
  const handleCategoryClick = (categoryId: string) => {
    setIsDropdownOpen(false); // Close the dropdown
    // Redirect to category page
    window.location.href = `/products/category/${categoryId}`;
  };

  // Close the dropdown if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-800 p-4 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Homepage */}
        <Link href="/" className="text-2xl font-semibold text-white hover:text-gray-300">
          ShopSmart
        </Link>

        {/* Shop by Category Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`${isActive('/products') ? 'text-gray-300' : 'hover:text-gray-300'} transition duration-300`}
            aria-haspopup="true"
            aria-expanded={isDropdownOpen ? 'true' : 'false'}
          >
            New Arrivals
          </button>
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-white text-black border border-gray-300 rounded-lg shadow-lg"
              role="menu"
            >
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id.toString())} // Navigate to the category page
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  role="menuitem"
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Other Links */}
        <Link href="/products" className={`${isActive('/products') ? 'text-gray-300' : 'hover:text-gray-300'} transition duration-300`}>
          Products
        </Link>
        {isAuthenticated && (
          <Link href="/checkout" className={`${isActive('/checkout') ? 'text-gray-300' : 'hover:text-gray-300'}`}>
            Checkout
          </Link>
        )}
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome, {user?.name}!</span>
            <button onClick={handleLogout} className="text-gray-300 hover:text-gray-400 transition duration-300">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link href="/login" className={`${isActive('/login') ? 'text-gray-300' : 'hover:text-gray-300'} transition duration-300`}>
              Login
            </Link>
            <Link href="/signup" className={`${isActive('/signup') ? 'text-gray-300' : 'hover:text-gray-300'} transition duration-300`}>
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
