import { MdOutlineEdit, MdVisibility } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ShowParcels() {
    const location = useLocation();
    const navigate = useNavigate();
    const [parcels, setParcels] = useState([]);
    const [filteredParcels, setFilteredParcels] = useState([]);
    const [city, setCity] = useState("");
    const [emailFilter, setEmailFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    useEffect(() => {
        // Get parcels and city from location state passed from search
        if (location.state) {
            const parcelsData = location.state.parcels || [];
            const cityData = location.state.city || "";
            
            setParcels(parcelsData);
            setFilteredParcels(parcelsData);
            setCity(cityData);
            
            // Save to sessionStorage for back navigation
            sessionStorage.setItem('postman_parcels', JSON.stringify(parcelsData));
            sessionStorage.setItem('postman_city', cityData);
        } else {
            // If no state, try to get from sessionStorage (for back navigation)
            const savedParcels = sessionStorage.getItem('postman_parcels');
            const savedCity = sessionStorage.getItem('postman_city');
            
            if (savedParcels) {
                const parsedParcels = JSON.parse(savedParcels);
                setParcels(parsedParcels);
                setFilteredParcels(parsedParcels);
                setCity(savedCity || "");
            } else {
                // If no data, redirect to search
                navigate("/postman/searchparcels");
            }
        }
    }, [location.state, navigate]);

    // Apply filters whenever filter values change
    useEffect(() => {
        let filtered = parcels;

        if (emailFilter) {
            filtered = filtered.filter(parcel => 
                parcel.email.toLowerCase().includes(emailFilter.toLowerCase())
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(parcel => parcel.status === statusFilter);
        }

        if (dateFilter) {
            filtered = filtered.filter(parcel => {
                const parcelDate = new Date(parcel.estimateDate).toISOString().split('T')[0];
                return parcelDate === dateFilter;
            });
        }

        setFilteredParcels(filtered);
    }, [emailFilter, statusFilter, dateFilter, parcels]);

    const clearFilters = () => {
        setEmailFilter("");
        setStatusFilter("");
        setDateFilter("");
    };

    const goBackToSearch = () => {
        navigate("/postman/searchparcels");
    };

    if (!parcels.length) {
        return (
            <div className="w-full p-6">
                <div className="flex items-center justify-center mb-6">
                    <img 
                        src="/mailbox.png" 
                        alt="Mailbox" 
                        className="w-16 h-16 mr-4"
                    />
                    <h1 className="text-3xl font-bold text-center">Parcel List</h1>
                </div>
                <div className="text-center mt-8">
                    <img 
                        src="/paper.png" 
                        alt="No parcels" 
                        className="w-24 h-24 mx-auto mb-4 opacity-50"
                    />
                    <p className="text-gray-500 text-lg font-medium mb-4">
                        No parcels data found.
                    </p>
                    <button
                        onClick={goBackToSearch}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Go to Search
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <img 
                        src="/mailbox.png" 
                        alt="Parcel List" 
                        className="w-16 h-16 mr-4"
                    />
                    <h1 className="text-3xl font-bold">Parcel List</h1>
                </div>
                <button
                    onClick={goBackToSearch}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                    New Search
                </button>
            </div>

            {/* Additional Filters */}
            {parcels.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-6 justify-center items-center bg-gray-50 p-4 rounded-lg shadow">
                    <input
                        type="text"
                        placeholder="Filter by Email"
                        value={emailFilter}
                        onChange={(e) => setEmailFilter(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                        <option value="">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <button
                        onClick={clearFilters}
                        className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded-lg text-white font-medium shadow transition"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Results Count */}
            {parcels.length > 0 && (
                <div className="text-center mb-4">
                    <p className="text-gray-600">
                        Showing {filteredParcels.length} of {parcels.length} parcels {city && `in ${city}`}
                    </p>
                </div>
            )}

            {/* Parcel Table */}
            {filteredParcels.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow">
                        <thead>
                            <tr className="text-center bg-blue-100">
                                <th className="p-3 font-semibold">Parcel ID</th>
                                <th className="p-3 font-semibold">Name</th>
                                <th className="p-3 font-semibold">E-mail</th>
                                <th className="p-3 font-semibold">Address</th>
                                <th className="p-3 font-semibold">City</th>
                                <th className="p-3 font-semibold">District</th>
                                <th className="p-3 font-semibold">Current Location</th>
                                <th className="p-3 font-semibold">Details</th>
                                <th className="p-3 font-semibold">Estimate Date</th>
                                <th className="p-3 font-semibold">Status</th>
                                <th className="p-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredParcels.map((parcel, index) => (
                                <tr
                                    key={index}
                                    className="text-center border-b hover:bg-blue-50 transition"
                                >
                                    <td className="p-3">{parcel.parcelID}</td>
                                    <td className="p-3">{parcel.name}</td>
                                    <td className="p-3">{parcel.email}</td>
                                    <td className="p-3">{parcel.address_line1}</td>
                                    <td className="p-3">{parcel.city}</td>
                                    <td className="p-3">{parcel.district}</td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                                            {parcel.currentLocation || 'Not Set'}
                                        </span>
                                    </td>
                                    <td className="p-3">{parcel.details}</td>
                                    <td className="p-3">
                                        {new Date(parcel.estimateDate).toLocaleDateString()}
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                            ${parcel.status === "Delivered" ? "bg-green-100 text-green-700" :
                                                parcel.status === "In Transit" ? "bg-yellow-100 text-yellow-700" :
                                                "bg-red-100 text-red-700"}`}>
                                            {parcel.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex justify-center gap-2">
                                            <MdVisibility
                                                onClick={() =>
                                                    navigate("/postman/showparceldetails/", { state: parcel })
                                                }
                                                className="text-[25px] hover:text-green-600 cursor-pointer transition"
                                                title="View Details"
                                            />
                                            <MdOutlineEdit
                                                onClick={() =>
                                                    navigate("/postman/editparcel/", { state: parcel })
                                                }
                                                className="text-[25px] hover:text-blue-600 cursor-pointer transition"
                                                title="Edit Parcel"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* No Results Found */}
            {parcels.length > 0 && filteredParcels.length === 0 && (
                <div className="text-center mt-8">
                    <img 
                        src="/paper.png" 
                        alt="No results" 
                        className="w-24 h-24 mx-auto mb-4 opacity-50"
                    />
                    <p className="text-gray-500 text-lg font-medium">
                        No parcels found matching the selected filters.
                    </p>
                </div>
            )}
        </div>
    );
}
