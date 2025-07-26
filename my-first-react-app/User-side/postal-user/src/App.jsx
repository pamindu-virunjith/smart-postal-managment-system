import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import OrdersPage from './pages/OrdersPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [email, setEmail] = useState('');

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const handleSignUp = () => {
    if (email.trim()) {
      alert(`Thank you! We'll send updates to: ${email}`);
      setEmail('');
    } else {
      alert('Please enter your email address');
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} navigateTo={navigateTo} />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'about' && <AboutPage navigateTo={navigateTo} />}
      {currentPage === 'orders' && <OrdersPage />}
      
      <Footer 
        email={email} 
        setEmail={setEmail} 
        handleSignUp={handleSignUp} 
        handleKeyPress={handleKeyPress} 
      />

      {/* Feedback Tab */}
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2">
        <div className="bg-pink-500 text-white px-3 py-8 rounded-l-lg cursor-pointer hover:bg-pink-600 transition-colors duration-200 writing-mode-vertical">
          <span className="transform rotate-90 inline-block text-sm font-semibold">
            Feedback
          </span>
        </div>
      </div>
    </div>
  );
};

export default App;