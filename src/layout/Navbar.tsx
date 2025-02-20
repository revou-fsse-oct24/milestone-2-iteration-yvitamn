'use client';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
//import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useNavbar } from '@/hooks/useNavbar';
import { ChevronDown, ChevronUp, ShoppingCart, User, LogOut, List, ShoppingBag } from 'lucide-react';


const Navbar = () => {
  const { userLogin, logout, isAuthenticated } = useAuth(); // Access user and authentication state
  const { categories, isActive } = useNavbar();
  //const pathname = usePathname(); 
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoggedOut, setIsLoggedOut] = useState(false); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  

  const handleCategoryClick = (categoryId: number | string) => {
    setIsDropdownOpen(false); // Close the dropdown after category selection
    router.push(`/categories/${categoryId}`); // Navigate to the selected category
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false); // Close dropdown if clicked outside
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const handleLogout = () => {
    logout(); // Call the logout function from context
    setIsLoggedOut(true);
    // You can also clear local storage or token if you're saving it
    localStorage.removeItem('token');
  };
  
  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen); // Toggle menu visibility
  // };

  return (
    <nav className="bg-gray-800 p-4 text-white">
    <div className="container mx-auto flex justify-between items-center">
      {/* Navbar Links Section */}
      <div className="flex space-x-6">
        {/* Home Link */}
        <Link href="/" className={isActive("/")}>
          Home
        </Link>

        {/* Products Link */}
        <Link href="/products" className={isActive("/products")}>
          <ShoppingBag className="inline mr-1" size={18} /> Products
        </Link>

        {/* Categories Dropdown */}
        <div className="relative inline-block text-left">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-white hover:text-gray-300"
          >
            <List className="inline mr-2" size={24} /> Categories
            {isDropdownOpen ? (
              <ChevronUp className="inline ml-1" size={16} />
            ) : (
              <ChevronDown className="inline ml-1" size={16} />
            )}
          </button>

          {isDropdownOpen && (
            <div
              className=
              "absolute left-0 mt-2 w-96 bg-black bg-opacity-50 text-white border border-gray-300 rounded-lg shadow-lg"
              ref={dropdownRef}
              role="menu"
            >
              <div className="py-2">
                {/* Iterate over categories and display each one */}
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {category.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Checkout Link (only visible when logged in) */}
        {isAuthenticated && !isLoggedOut && (
          <Link href="/checkout" className={isActive("/checkout")}>
            <ShoppingCart className="inline mr-1" size={18} /> Checkout
          </Link>
        )}
      </div>

      {/* User Links (Login/SignUp or User Profile + Logout) */}
      <div className="flex items-center space-x-6">
        {isAuthenticated && !isLoggedOut ? (
          <>
            <span className="text-gray-300">{userLogin?.name}</span>
            <span
              onClick={handleLogout}
              className="cursor-pointer hover:text-gray-300"
            >
              <LogOut className="inline mr-1" size={18} /> Logout
            </span>
          </>
        ) : (
          <>
            <Link href="/login" className={isActive("/login")}>
              <User className="inline mr-1" size={18} /> Login
            </Link>
            <Link href="/signup" className={isActive("/signup")}>
              <User className="inline mr-1" size={18} /> Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  </nav>
);
};
export default Navbar;
