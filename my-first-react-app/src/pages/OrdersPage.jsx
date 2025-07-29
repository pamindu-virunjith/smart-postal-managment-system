import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const navigate =useNavigate();

  const [orders,setOrders] = useState([]);
  


  axios.get(import.meta.env.VITE_BACKEND_URL + "/api/parcel", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
  .then(response => {
    setOrders(response.data);
  })
  .catch(error => {
    console.error("Error fetching orders:", error);
  });

  

  const handleTrackNew = () => {
    navigate("/home")
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
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Your <span className="text-pink-300">Orders</span>
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
                Track and manage all your packages in one convenient dashboard
              </p>
            </div>
            
            {/* Orders Table Section */}
            <div className="bg-black/20 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
                <h2 className="text-2xl font-semibold text-pink-300">Recent Orders</h2>
                <button 
                  onClick={handleTrackNew}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-pink-400 cursor-pointer"
                >
                  Track New Package
                </button>
              </div>
              
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="px-4 py-4 text-left text-pink-300 font-semibold">Tracking Number</th>
                      <th className="px-4 py-4 text-left text-pink-300 font-semibold">Name</th>
                      <th className="px-4 py-4 text-left text-pink-300 font-semibold">Description</th>
                      
                      <th className="px-4 py-4 text-left text-pink-300 font-semibold">Status</th>
                      
                      <th className="px-4 py-4 text-left text-pink-300 font-semibold">Est. Delivery</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                        <td className="px-4 py-4 font-mono text-sm text-white">{order.parcelID}</td>
                        <td className="px-4 py-4 text-purple-100">{order.name}</td>
                        <td className="px-4 py-4 text-purple-100">{order.details}</td>
                        <td className="px-4 py-4 text-purple-100">{order.status}</td>
                        <td className="px-4 py-4 text-purple-100">{new Date(order.estimateDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-mono text-sm text-white">{order._id}</p>
                        <p className="text-purple-100">{order.details}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-200">Tracking Number:</span>
                        <span className="text-white">{order.parcelID}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-200">Name:</span>
                        <span className="text-white">{order.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-200">Status:</span>
                        <span className="text-white">{order.status}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-200">Es.Date:</span>
                        <span className="text-white">{new Date(order.estimateDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl font-bold text-pink-300 mb-2">
                  {orders.length}
                </div>
                <div className="text-purple-100 text-lg">Total Orders</div>
                <div className="w-full bg-white/20 rounded-full h-1 mt-3">
                  <div className="bg-gradient-to-r from-pink-400 to-purple-500 h-1 rounded-full w-full"></div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl font-bold text-green-300 mb-2">
                  {orders.filter(order => order.status === 'Delivered').length}
                </div>
                <div className="text-purple-100 text-lg">Delivered</div>
                <div className="w-full bg-white/20 rounded-full h-1 mt-3">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-1 rounded-full w-3/4"></div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-4xl font-bold text-blue-300 mb-2">
                  {orders.filter(order => order.status === 'In Transit' || order.status === 'Out for Delivery').length}
                </div>
                <div className="text-purple-100 text-lg">In Transit</div>
                <div className="w-full bg-white/20 rounded-full h-1 mt-3">
                  <div className="bg-gradient-to-r from-blue-400 to-cyan-500 h-1 rounded-full w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;