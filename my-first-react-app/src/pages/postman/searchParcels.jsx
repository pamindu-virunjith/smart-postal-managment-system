import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { VscLoading } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

export default function SearchParcels() {
    const [city, setCity] = useState("");
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    // Search parcels by city and navigate to results
    const handleCitySearch = () => {
        if (!city.trim()) {
            toast.error("Please enter a city");
            return;
        }

        setLoading(true);

        axios
            .get(import.meta.env.VITE_BACKEND_URL + "/api/parcel", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
            .then((response) => {
                const cityFiltered = response.data.filter(
                    (parcel) =>
                        parcel.city?.trim().toLowerCase() === city.trim().toLowerCase()
                );

                // Navigate to showParcels with the filtered results
                navigate("/postman/showparcels", { 
                    state: { 
                        parcels: cityFiltered, 
                        city: city 
                    } 
                });
            })
            .catch(() => {
                toast.error("Failed to fetch parcels");
                setLoading(false);
            });
    };

    return (
        <div className="w-full p-6">
            {/* Header with icon */}
            <div className="flex items-center justify-center mb-6">
                <img 
                    src="/mailbox.png" 
                    alt="Mailbox" 
                    className="w-16 h-16 mr-4"
                />
                <h1 className="text-3xl font-bold text-center">Search Parcels</h1>
            </div>

            {/* City Search */}
            <div className="flex flex-col items-center mb-6">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    {/* Search icon */}
                    <div className="flex justify-center mb-4">
                        <img 
                            src="https://img.freepik.com/premium-vector/vector-illustration-delivery-courier-holding-package-with-delivery-truck-background_675567-2242.jpg" 
                            alt="Search" 
                            className="w-100 h-70"
                        />
                    </div>
                    <h2 className="text-xl font-semibold mb-4 text-center">Enter City to Search</h2>
                    <input
                        type="text"
                        placeholder="Enter city name"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !loading && handleCitySearch()}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-4"
                        disabled={loading}
                    />
                    <button
                        onClick={handleCitySearch}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <VscLoading className="animate-spin mr-2" />
                                Searching...
                            </div>
                        ) : (
                            "Search Parcels"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
