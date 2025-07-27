import React from 'react';
import { useState } from 'react';
import { BiLogoFacebook, BiLogoInstagram, BiLogoLinkedin, BiLogoTwitter } from 'react-icons/bi';


const Footer = () => {

  const [email, setEmail] = useState('');
  const currentYear = new Date().getFullYear();


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

  const handleSocialClick = (platform) => {
    alert(`Navigate to ${platform} page`);
  };

  const handleLinkClick = (link) => {
    alert(`Navigate to ${link} page`);
  };

  return (
    <footer className="bg-red-900 text-white">
      {/* Email Signup Section */}
      <div className="bg-pink-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-pink-200">
            See Incoming Mail in Your Email
          </h2>
          <p className="text-lg mb-8 text-pink-200">
            Get real-time notifications about your packages and deliveries
          </p>
          <div className="flex justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleSignUp)}
              className="flex-1 px-4 py-3 bg-white/90 text-gray-900 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-400 "
            />
            <button
              onClick={handleSignUp}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 font-semibold rounded-r-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="text-center md:col-span-1">
              <div className="text-2xl font-bold text-pink-300 mb-4">LOGO</div>
              <p className="text-purple-200 mb-4">
                Your trusted partner for reliable mail and parcel tracking services across Sri Lanka and beyond.
              </p>
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => handleSocialClick('Facebook')}
                  className="w-10 h-10 bg-purple-700 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <span className="text-sm font-bold"><BiLogoFacebook className='text-3xl'/></span>
                </button>
                <button 
                  onClick={() => handleSocialClick('Twitter')}
                  className="w-10 h-10 bg-purple-700 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <span className="text-sm font-bold"><BiLogoTwitter className='text-2xl'/></span>
                </button>
                <button 
                  onClick={() => handleSocialClick('Instagram')}
                  className="w-10 h-10 bg-purple-700 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <span className="text-sm font-bold"><BiLogoInstagram className='text-3xl'/></span>
                </button>
                <button 
                  onClick={() => handleSocialClick('LinkedIn')}
                  className="w-10 h-10 bg-purple-700 hover:bg-purple-600 rounded-full flex items-center justify-center transition-colors duration-200"
                >
                  <span className="text-sm font-bold"><BiLogoLinkedin className='text-2xl'/></span>
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className='text-center'>
              <h3 className="text-lg font-semibold text-pink-200 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => handleLinkClick('Track Package')}
                    className="text-purple-200 hover:text-pink-300 transition-colors duration-200"
                  >
                    Track Package
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleLinkClick('Shipping Rates')}
                    className="text-purple-200 hover:text-pink-300 transition-colors duration-200"
                  >
                    Shipping Rates
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleLinkClick('Service Areas')}
                    className="text-purple-200 hover:text-pink-300 transition-colors duration-200"
                  >
                    Service Areas
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleLinkClick('Delivery Options')}
                    className="text-purple-200 hover:text-pink-300 transition-colors duration-200"
                  >
                    Delivery Options
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleLinkClick('Business Solutions')}
                    className="text-purple-200 hover:text-pink-300 transition-colors duration-200"
                  >
                    Business Solutions
                  </button>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className='text-center'>
              <h3 className="text-lg font-semibold text-pink-200 mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => handleLinkClick('Help Center')}
                    className="text-purple-200 hover:text-pink-300 transition-colors duration-200"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleLinkClick('Contact Us')}
                    className="text-purple-200 hover:text-pink-300 transition-colors duration-200"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleLinkClick('FAQs')}
                    className="text-purple-200 hover:text-pink-300 transition-colors duration-200"
                  >
                    FAQs
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleLinkClick('Live Chat')}
                    className="text-purple-200 hover:text-pink-300 transition-colors duration-200"
                  >
                    Live Chat
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleLinkClick('Report Issue')}
                    className="text-purple-200 hover:text-pink-300 transition-colors duration-200"
                  >
                    Report Issue
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className='text-center md:text-left'>
              <h3 className="text-center text-lg font-semibold text-pink-200 mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex justify-center md:justify-start items-start space-x-3">
                  <div className="hidden md:block w-5 h-5 bg-pink-500 rounded-full flex-shrink-0 mt-0.5"></div>
                  <div>
                    <p className="text-purple-200 text-sm">Address</p>
                    <p className="text-white">Department of Posts
                        <br />D.R. Wijewardena Mawatha
                        <br />Colombo 10, Sri Lanka</p>

                  </div>
                </div>
                <div className="flex justify-center md:justify-start items-start space-x-3">
                  <div className="hidden md:block w-5 h-5 bg-pink-500 rounded-full flex-shrink-0 mt-0.5"></div>
                  <div>
                    <p className="text-purple-200 text-sm">Phone</p>
                    <p className="text-white"> +94 112 321 201 <br/>General Inquiries </p>
                  </div>
                </div>
                <div className="flex justify-center md:justify-start items-start space-x-3">
                  <div className="hidden md:block w-5 h-5 bg-pink-500 rounded-full flex-shrink-0 mt-0.5"></div>
                  <div>
                    <p className="text-purple-200 text-sm">Email</p>
                    <p className="text-white">info@slpost.gov.lk<br/>customerservice@slpost.gov.lk</p>
                  </div>
                </div>
                <div className="flex justify-center md:justify-start items-start space-x-3">
                  <div className="hidden md:block w-5 h-5 bg-pink-500 rounded-full flex-shrink-0 mt-0.5"></div>
                  <div>
                    <p className="text-purple-200 text-sm">Hours</p>
                    <p className="text-white">24/7 Customer Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-purple-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-purple-200 text-sm">
              © {currentYear} Mail Tracking. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <button 
                onClick={() => handleLinkClick('Privacy Policy')}
                className="text-purple-200 hover:text-pink-300 transition-colors duration-200"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => handleLinkClick('Terms of Service')}
                className="text-purple-200 hover:text-pink-300 transition-colors duration-200"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => handleLinkClick('Cookie Policy')}
                className="text-purple-200 hover:text-pink-300 transition-colors duration-200"
              >
                Cookie Policy
              </button>
              <button 
                onClick={() => handleLinkClick('Accessibility')}
                className="text-purple-200 hover:text-pink-300 transition-colors duration-200"
              >
                Accessibility
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;