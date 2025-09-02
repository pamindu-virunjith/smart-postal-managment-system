import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiCalendar, FiUser, FiFileText, FiPlus, FiTrendingUp, FiStar, FiEye } from 'react-icons/fi';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;

    if (!email) {
      console.error("No user email found in localStorage");
      return;
    }

    axios.get(import.meta.env.VITE_BACKEND_URL + "/api/parcel", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(response => {
      // Filter orders by logged-in user's email
      const filteredOrders = response.data.filter(order => order.email === email);
      setOrders(filteredOrders);
    })
    .catch(error => {
      console.error("Error fetching orders:", error);
    });
  }, []);

  const handleTrackNew = () => {
    navigate("/home");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <FiCheckCircle className="text-green-400" />;
      case "In Transit":
      case "Out for Delivery":
        return <FiTruck className="text-blue-400" />;
      case "Pending":
        return <FiClock className="text-yellow-400" />;
      default:
        return <FiPackage className="text-gray-400" />;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500/20 text-green-300 border-green-400/30";
      case "In Transit":
      case "Out for Delivery":
        return "bg-blue-500/20 text-blue-300 border-blue-400/30";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-400/30";
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(125, 6, 6, 0.7), rgba(109, 2, 50, 0.3)), url('https://images.pexels.com/photos/10202994/pexels-photo-10202994.jpeg')`
        }}
      ></div>

      <main className="relative z-10 pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full mb-6 backdrop-blur-sm border border-pink-300/30">
                <FiPackage className="text-4xl text-pink-300" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent">
                Your <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Orders</span>
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
                Track and manage all your packages in one convenient dashboard with real-time updates
              </p>
              <div className="flex items-center justify-center mt-8 space-x-6">
                <div className="flex items-center text-purple-200">
                  <FiStar className="text-yellow-400 mr-2" />
                  <span className="text-sm">Premium Tracking</span>
                </div>
                <div className="flex items-center text-purple-200">
                  <FiTrendingUp className="text-green-400 mr-2" />
                  <span className="text-sm">Real-time Updates</span>
                </div>
              </div>
            </div>
            
            {/* Orders Table Section */}
            <div className="bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-12 border border-white/20 hover:border-pink-300/30 transition-all duration-500">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl mr-4 backdrop-blur-sm">
                    <FiFileText className="text-2xl text-pink-300" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Your Orders</h2>
                    <p className="text-purple-200 text-sm">{orders.length} total packages</p>
                  </div>
                </div>
                <button 
                  onClick={handleTrackNew}
                  className="group relative bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-pink-400/50 cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="relative flex items-center">
                    <FiPlus className="mr-2 text-lg" />
                    Track New Package
                  </div>
                </button>
              </div>
              
              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center p-6 bg-gradient-to-r from-gray-500/10 to-gray-400/10 rounded-full mb-6">
                    <FiPackage className="text-6xl text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">No Orders Yet</h3>
                  <p className="text-purple-200 mb-8 max-w-md mx-auto">Start tracking your first package to see your order history here.</p>
                  <button 
                    onClick={handleTrackNew}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:-translate-y-1"
                  >
                    Get Started
                  </button>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="border-b border-white/20">
                          <th className="px-6 py-5 text-left text-pink-300 font-bold text-lg">
                            <div className="flex items-center">
                              <FiPackage className="mr-2" />
                              Tracking #
                            </div>
                          </th>
                          <th className="px-6 py-5 text-left text-pink-300 font-bold text-lg">
                            <div className="flex items-center">
                              <FiUser className="mr-2" />
                              Recipient
                            </div>
                          </th>
                          <th className="px-6 py-5 text-left text-pink-300 font-bold text-lg">
                            <div className="flex items-center">
                              <FiFileText className="mr-2" />
                              Details
                            </div>
                          </th>
                          <th className="px-6 py-5 text-left text-pink-300 font-bold text-lg">
                            <div className="flex items-center">
                              <FiTruck className="mr-2" />
                              Status
                            </div>
                          </th>
                          <th className="px-6 py-5 text-left text-pink-300 font-bold text-lg">
                            <div className="flex items-center">
                              <FiCalendar className="mr-2" />
                              Delivery
                            </div>
                          </th>
                          <th className="px-6 py-5 text-left text-pink-300 font-bold text-lg">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, index) => (
                          <tr key={order._id} className="border-b border-white/10 hover:bg-white/5 transition-all duration-300 group" style={{animationDelay: `${index * 100}ms`}}>
                            <td className="px-6 py-5">
                              <div className="font-mono text-sm text-white bg-gray-800/50 px-3 py-2 rounded-lg inline-block">
                                {order.parcelID}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="text-white font-semibold">{order.name}</div>
                              <div className="text-purple-300 text-sm">{order.email}</div>
                            </td>
                            <td className="px-6 py-5 text-purple-100 max-w-xs truncate">{order.details}</td>
                            <td className="px-6 py-5">
                              <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold border ${getStatusBadgeColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="ml-2">{order.status}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="text-white font-medium">{new Date(order.estimateDate).toLocaleDateString()}</div>
                              <div className="text-purple-300 text-sm">{new Date(order.estimateDate).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            </td>
                            <td className="px-6 py-5">
                              <button className="group/btn bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-blue-300 hover:text-white px-4 py-2 rounded-xl transition-all duration-200 border border-blue-400/30 hover:border-blue-400/50">
                                <FiEye className="group-hover/btn:scale-110 transition-transform duration-200" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Tablet and Mobile Card View */}
                  <div className="lg:hidden space-y-6">
                    {orders.map((order, index) => (
                      <div 
                        key={order._id} 
                        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-pink-300/30 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-2xl"
                        style={{animationDelay: `${index * 150}ms`}}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center">
                            <div className="p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl mr-3">
                              <FiPackage className="text-xl text-pink-300" />
                            </div>
                            <div>
                              <p className="font-mono text-sm text-white bg-gray-800/50 px-3 py-1 rounded-lg inline-block mb-1">{order.parcelID}</p>
                              <p className="text-purple-100 font-semibold">{order.name}</p>
                            </div>
                          </div>
                          <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold border ${getStatusBadgeColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-2">{order.status}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <FiFileText className="text-purple-300 mt-1 mr-3 flex-shrink-0" />
                            <div>
                              <span className="text-purple-200 text-sm block">Package Details</span>
                              <span className="text-white">{order.details}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <FiMapPin className="text-purple-300 mr-3 flex-shrink-0" />
                            <div>
                              <span className="text-purple-200 text-sm block">Delivery Address</span>
                              <span className="text-white">{order.address || `${order.address_line1}, ${order.city}`}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <FiCalendar className="text-purple-300 mr-3 flex-shrink-0" />
                            <div>
                              <span className="text-purple-200 text-sm block">Estimated Delivery</span>
                              <span className="text-white">{new Date(order.estimateDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                          <button className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-blue-300 hover:text-white px-4 py-2 rounded-xl transition-all duration-200 border border-blue-400/30 hover:border-blue-400/50 flex items-center">
                            <FiEye className="mr-2" />
                            View Details
                          </button>
                          <span className="text-xs text-purple-400">ID: {order._id?.slice(-6)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Statistics Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group bg-gradient-to-br from-black/10 to-black/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center border border-black/20 hover:border-pink-300/40 transition-all duration-500 transform hover:-translate-y-3 hover:shadow-pink-500/20">
                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FiPackage className="text-3xl text-pink-300" />
                </div>
                <div className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  {orders.length}
                </div>
                <div className="text-purple-100 text-xl font-semibold mb-4">Total Orders</div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-gradient-to-r from-pink-400 to-purple-500 h-2 rounded-full w-full transition-all duration-1000 hover:shadow-lg hover:shadow-pink-400/50"></div>
                </div>
                <div className="mt-4 text-sm text-purple-300">All time packages</div>
              </div>
              
              <div className="group bg-gradient-to-br from-black/10 to-black/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center border border-black/20 hover:border-green-300/40 transition-all duration-500 transform hover:-translate-y-3 hover:shadow-green-500/20">
                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FiCheckCircle className="text-3xl text-green-300" />
                </div>
                <div className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {orders.filter(order => order.status === 'Delivered').length}
                </div>
                <div className="text-purple-100 text-xl font-semibold mb-4">Delivered</div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-1000 hover:shadow-lg hover:shadow-green-400/50" 
                    style={{width: `${orders.length > 0 ? (orders.filter(order => order.status === 'Delivered').length / orders.length) * 100 : 0}%`}}
                  ></div>
                </div>
                <div className="mt-4 text-sm text-purple-300">Successfully completed</div>
              </div>
              
              <div className="group bg-gradient-to-br from-black/10 to-black/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center border border-black/20 hover:border-blue-300/40 transition-all duration-500 transform hover:-translate-y-3 hover:shadow-blue-500/20">
                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FiTruck className="text-3xl text-blue-300" />
                </div>
                <div className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {orders.filter(order => order.status === 'In Transit' || order.status === 'Out for Delivery' || order.status === 'Pending').length}
                </div>
                <div className="text-purple-100 text-xl font-semibold mb-4">In Progress</div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-cyan-500 h-2 rounded-full transition-all duration-1000 hover:shadow-lg hover:shadow-blue-400/50" 
                    style={{width: `${orders.length > 0 ? (orders.filter(order => order.status === 'In Transit' || order.status === 'Out for Delivery' || order.status === 'Pending').length / orders.length) * 100 : 0}%`}}
                  ></div>
                </div>
                <div className="mt-4 text-sm text-purple-300">Currently shipping</div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;
