import React from 'react';

const AboutPage = ({ navigateTo }) => {
  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(125, 6, 6, 0.7), rgba(109, 2, 50, 0.3)), url('https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80')`
        }}
      ></div>

      <main className="relative z-10 pt-20 lg:pt-32 pb-8 lg:pb-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Hero Section */}
            <div className="text-center mb-10 lg:mb-16">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 lg:mb-6">
                About <span className="text-pink-300">Us</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto px-4">
                Connecting the world through reliable package tracking and delivery services
              </p>
            </div>
            
            {/* Mission Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl shadow-xl p-6 lg:p-8 mb-6 lg:mb-8 border border-white/20 mx-4 sm:mx-auto">
              <h2 className="text-2xl lg:text-3xl font-semibold text-pink-300 mb-4 lg:mb-6 text-center">Our Mission</h2>
              <p className="text-white text-base lg:text-lg leading-relaxed mb-4 lg:mb-6 text-center">
                We are dedicated to providing the most reliable and efficient mail tracking service. 
                Our platform helps millions of users track their packages and stay updated on their 
                deliveries in real-time, making shipping transparent and stress-free.
              </p>
            </div>
            
            {/* Features Grid */}
            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-pink-300 mb-8 text-center">Why Choose Us?</h2>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 px-4 sm:px-0">
                <div className="bg-white/10 backdrop-blur-md p-4 lg:p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 lg:hover:-translate-y-2">
                  <div className="flex items-center mb-3 lg:mb-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-pink-500 rounded-full flex items-center justify-center mr-3 lg:mr-4">
                      <div className="w-5 h-5 lg:w-6 lg:h-6 bg-white rounded-full"></div>
                    </div>
                    <h3 className="text-lg lg:text-xl font-semibold text-pink-300">Real-time Tracking</h3>
                  </div>
                  <p className="text-sm lg:text-base text-purple-100">
                    Get instant updates on your package location and delivery status with our 
                    advanced tracking system powered by AI and machine learning.
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mr-4">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-pink-300">Multiple Carriers</h3>
                  </div>
                  <p className="text-purple-100">
                    Track packages from all major shipping carriers including FedEx, UPS, DHL, 
                    USPS and 200+ international carriers in one convenient location.
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mr-4">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-pink-300">Smart Notifications</h3>
                  </div>
                  <p className="text-purple-100">
                    Never miss an update with our intelligent email and SMS notification system 
                    that learns your preferences and delivery patterns.
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mr-4">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-pink-300">24/7 Support</h3>
                  </div>
                  <p className="text-purple-100">
                    Our dedicated customer support team is available around the clock via chat, 
                    email, and phone to assist you with any tracking questions.
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-8 mb-8 lg:mb-12 px-4 sm:px-0">
              <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-6 lg:p-8 border border-white/20 transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl lg:text-4xl font-bold text-pink-300 mb-1 lg:mb-2">15M+</div>
                <div className="text-white text-sm lg:text-lg">Packages Tracked Monthly</div>
              </div>
              
              <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-6 lg:p-8 border border-white/20 transform hover:scale-105 transition-all duration-300">
                <div className="text-3xl lg:text-4xl font-bold text-pink-300 mb-1 lg:mb-2">200+</div>
                <div className="text-white text-sm lg:text-lg">Shipping Carriers</div>
              </div>
              
              <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-6 lg:p-8 border border-white/20 transform hover:scale-105 transition-all duration-300 sm:col-span-2 md:col-span-1">
                <div className="text-3xl lg:text-4xl font-bold text-pink-300 mb-1 lg:mb-2">50+</div>
                <div className="text-white text-sm lg:text-lg">Countries Supported</div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-md text-white rounded-xl lg:rounded-2xl p-6 lg:p-8 text-center border border-white/20 mx-4 sm:mx-0">
              <h2 className="text-2xl lg:text-3xl font-bold mb-3 lg:mb-4">Join Millions of Satisfied Users</h2>
              <p className="text-base lg:text-xl mb-4 lg:mb-6 text-purple-100">
                Experience the future of package tracking today with our cutting-edge platform
              </p>
              <button 
                onClick={() => navigateTo('home')}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 lg:px-8 py-2 lg:py-3 text-sm lg:text-base rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 lg:focus:ring-4 focus:ring-pink-400"
              >
                Start Tracking Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;