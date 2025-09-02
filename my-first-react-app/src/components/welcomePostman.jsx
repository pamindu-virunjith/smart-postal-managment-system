// src/components/admin/WelcomeAdmin.jsx
import React from "react";

export default function WelcomePostman() {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userName = storedUser?.name || "Postman";

return (
    <div className="flex flex-col justify-center items-center h-full">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
            Welcome {userName}!
        </h1>
        <p className="text-lg text-gray-700 text-center max-w-xl">
            You have successfully logged in as a <span className="font</p>-semibold">Postman</span>.  
            From here, you can manage your assigned parcels, update their status,  
            or create accounts for new users.  
        </p>
        <img 
            src="/postman.jpg" 
            alt="Postman" 
            className="w-65 h-80 mt-6"
        />
    </div>
    );
}
