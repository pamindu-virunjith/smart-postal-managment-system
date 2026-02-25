import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import logo from '../assets/logo.png';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;

  const handleSignOut = () => {
    localStorage.removeItem("token");
    console.log("Signed out");
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <img
            src={logo}
            alt="Logo"
            className="h-10 w-10 mr-3 "
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <button 
            onClick={() => navigate("/home")}
            className={`hover:text-pink-500 transition-colors duration-200 text-lg font-medium cursor-pointer focus:outline-none ${
              path == "/home" || path == "/"
                ? 'text-pink-300 border-b-2 border-pink-300 pb-1' 
                : 'text-white hover:border-b-2 hover:border-pink-300 hover:pb-1'
            }`}
          >
            Home
          </button>
          <button 
            onClick={() => navigate("/orders")}
            className={`hover:text-pink-300 transition-all duration-200 text-lg font-medium cursor-pointer focus:outline-none ${
              path == "/orders"
                ? 'text-pink-300 border-b-2 border-pink-300 pb-1' 
                : 'text-white hover:border-b-2 hover:border-pink-300 hover:pb-1'
            }`}
          >
            Orders
            </button>
          <button 
            onClick={() => navigate("/about")}
            className={`hover:text-pink-300 transition-all duration-200 text-lg font-medium cursor-pointer focus:outline-none ${
              path == "/about"
                ? 'text-pink-300 border-b-2 border-pink-300 pb-1' 
                : 'text-white hover:border-b-2 hover:border-pink-300 hover:pb-1'
            }`}
          >
            About
          </button>
          <button 
            onClick={handleSignOut}
            className="group relative bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-red-400/50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <div className="relative flex items-center">
              <FiLogOut className="mr-2 text-lg group-hover:rotate-12 transition-transform duration-300" />
              Sign Out
            </div>
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white hover:text-pink-500 transition-colors duration-200 p-2 focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <FiX className="w-6 h-6" />
          ) : (
            <FiMenu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen 
          ? 'max-h-96 opacity-50 visible' 
          : 'max-h-0 opacity-0 invisible'
      } overflow-hidden bg-white/15 backdrop-blur-md border-t border-white/20`}>
        <nav className="container mx-auto px-4 py-4 space-y-4">
          <button 
            onClick={() => {
              navigate("/home");
              closeMobileMenu();
            }}
            className={`block w-full text-left py-3 px-4 rounded-lg transition-all duration-200 text-lg font-medium ${
              path == "/home" || path == "/"
                ? 'text-black-300 bg-white/10 border-l-4 border-pink-300' 
                : 'text-black hover:text-pink-300 hover:bg-white/10 hover:border-l-4 hover:border-pink-300'
            }`}
          >
            Home
          </button>
          <button 
            onClick={() => {
              navigate("/about");
              closeMobileMenu();
            }}
            className={`block w-full text-left py-3 px-4 rounded-lg transition-all duration-200 text-lg font-medium ${
              path == "/about"
                ? 'text-pink-300 bg-white/10 border-l-4 border-pink-300' 
                : 'text-black hover:text-pink-300 hover:bg-white/10 hover:border-l-4 hover:border-pink-300'
            }`}
          >
            About
          </button>
          <button 
            onClick={() => {
              navigate("/orders");
              closeMobileMenu();
            }}
            className={`block w-full text-left py-3 px-4 rounded-lg transition-all duration-200 text-lg font-medium ${
              path == "/orders"
                ? 'text-pink-300 bg-white/10 border-l-4 border-pink-300' 
                : 'text-black hover:text-pink-300 hover:bg-white/10 hover:border-l-4 hover:border-pink-300'
            }`}
          >
            Orders
          </button>
          <button 
            onClick={() => {
              handleSignOut();
              closeMobileMenu();
            }}
            className="group w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-3 px-4 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 mt-4 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <div className="relative flex items-center justify-center">
              <FiLogOut className="mr-2 text-lg group-hover:rotate-12 transition-transform duration-300" />
              Sign Out
            </div>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;