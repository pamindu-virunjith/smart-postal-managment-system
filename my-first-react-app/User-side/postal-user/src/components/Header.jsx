import React from 'react';

const Header = ({ currentPage, navigateTo }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div 
          className="text-2xl font-bold text-white cursor-pointer hover:text-pink-300 transition-colors duration-200"
          onClick={() => navigateTo('home')}
        >
          LOGO
        </div>
        <nav className="flex space-x-8">
          <button 
            onClick={() => navigateTo('home')}
            className={`hover:text-pink-500 transition-colors duration-200 text-lg font-medium ${
              currentPage === 'home' 
                ? 'text-pink-300 border-b-2 border-pink-300 pb-1' 
                : 'text-white hover:border-b-2 hover:border-pink-300 hover:pb-1'
            }`}
          >
            Home
          </button>
          <button 
            onClick={() => navigateTo('about')}
            className={`hover:text-pink-300 transition-all duration-200 text-lg font-medium ${
              currentPage === 'about' 
                ? 'text-pink-300 border-b-2 border-pink-300 pb-1' 
                : 'text-white hover:border-b-2 hover:border-pink-300 hover:pb-1'
            }`}
          >
            About
          </button>
          <button 
            onClick={() => navigateTo('orders')}
            className={`hover:text-pink-300 transition-all duration-200 text-lg font-medium ${
              currentPage === 'orders' 
                ? 'text-pink-300 border-b-2 border-pink-300 pb-1' 
                : 'text-white hover:border-b-2 hover:border-pink-300 hover:pb-1'
            }`}
          >
            Orders
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;