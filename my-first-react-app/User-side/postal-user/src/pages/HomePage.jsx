import React, { useState } from 'react';

const HomePage = () => {
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleSearch = () => {
    if (trackingNumber.trim()) {
      alert(`Searching for tracking number: ${trackingNumber}`);
    } else {
      alert('Please enter a tracking number');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(125, 6, 6, 0.7), rgba(109, 2, 50, 0.3)), url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80')`,
        }}
      ></div>

      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Track Your <span className="text-pink-300">Packages</span>
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-3xl mx-auto">
            Get real-time updates on your deliveries from all major carriers in one place
          </p>

          {/* Search Section */}
          <div className="flex justify-center mb-16">
            <div className="flex w-full max-w-2xl">
              <input
                type="text"
                placeholder="Enter Tracking Number(s)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-6 py-4 text-lg border-2 border-transparent rounded-l-lg focus:outline-none focus:ring-4 focus:ring-pink-400 focus:border-pink-400 shadow-lg backdrop-blur-sm bg-white/90"
              />
              <button
                onClick={handleSearch}
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-r-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-pink-400 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section with Glass Background */}
      <main className="relative z-10 pb-12">
        <div className="container mx-auto px-4">
          
          {/* Features Section */}
          <div className="mb-16">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Real-Time Tracking</h3>
                <p className="text-purple-100">Monitor your packages every step of the way</p>
              </div>
              
              <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Multiple Carriers</h3>
                <p className="text-purple-100">Support for all major shipping companies</p>
              </div>
              
              <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="w-16 h-16 bg-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Instant Notifications</h3>
                <p className="text-purple-100">Get updates delivered to your email</p>
              </div>
            </div>
          </div>

         

          {/* Illustration Section */}
          <div className="flex justify-center mb-16">
            <div className="relative">
              <div className="">
                <div className="w-32 h-48 relative">
                  {/* Head */}
                  <div className="w-16 h-16 bg-pink-300 rounded-full mx-auto mb-2 shadow-lg"></div>
                  {/* Hair */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-12 bg-gray-800 rounded-t-full shadow-md"></div>
                  {/* Body */}
                  <div className="w-20 h-24 bg-pink-400 rounded-lg mx-auto mb-2 shadow-lg"></div>
                  {/* Skirt */}
                  <div className="w-24 h-16 bg-gray-700 mx-auto rounded-b-lg shadow-lg"></div>
                </div>
                {/* Decorative dots */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-pink-300 mb-2">10M+</div>
              <div className="text-white text-lg">Packages Tracked</div>
            </div>
            
            <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-pink-300 mb-2">500K+</div>
              <div className="text-white text-lg">Happy Customers</div>
            </div>
            
            <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
              <div className="text-4xl font-bold text-pink-300 mb-2">99.9%</div>
              <div className="text-white text-lg">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;