// src/components/admin/WelcomeAdmin.jsx
import React from "react";

export default function WelcomeAdmin() {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userName = storedUser?.name || "Postman";

return (
    <div
        className="flex flex-col justify-center items-center h-full"
        style={{
            backgroundImage: 'url("/bg.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            backgroundColor: 'rgba(255,255,255,0.7)', // semi-transparent white overlay
            backgroundBlendMode: 'overlay',
        }}
    >
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
            Welcome {userName}! 🎉
        </h1>
        <p className="text-lg text-gray-600 max-w-xl">
            You are logged in as an administrator.  
            Use the left menu to manage users, parcels and accounts.  
            Have a productive session!
        </p>
        <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Admin"
            className="w-40 mt-6"
        />
    </div>
    );
}
