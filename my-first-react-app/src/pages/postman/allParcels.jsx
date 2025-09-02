import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineEdit, MdVisibility } from "react-icons/md";
import { VscLoading } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

export default function AllParcels() {
    const [parcels, setParcels] = useState([]);
    const [filteredParcels, setFilteredParcels] = useState([]);
    const [loaded, setLoaded] = useState(false);
    
    const [emailFilter, setEmailFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    
    const navigate = useNavigate();

    // Fetch all parcels on component mount
    useEffect(() => {
        fetchAllParcels();
    }, []);

    const fetchAllParcels = () => {
        setLoaded(false);
        
        axios
            .get(import.meta.env.VITE_BACKEND_URL + "/api/parcel", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
            .then((response) => {
                setParcels(response.data);
                setFilteredParcels(response.data);
                setLoaded(true);
            })
            .catch(() => {
                toast.error("Failed to fetch parcels");
                setLoaded(true);
            });
    };

    // Apply filters
    useEffect(() => {
        let filtered = [...parcels];

        if (emailFilter) {
            filtered = filtered.filter(parcel =>
                parcel.email?.toLowerCase().includes(emailFilter.toLowerCase())
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(parcel => parcel.status === statusFilter);
        }

        if (cityFilter) {
            filtered = filtered.filter(parcel =>
                parcel.city?.toLowerCase().includes(cityFilter.toLowerCase())
            );
        }

        if (dateFilter) {
            filtered = filtered.filter(parcel => {
                const parcelDate = new Date(parcel.estimateDate).toISOString().split('T')[0];
                return parcelDate === dateFilter;
            });
        }

        setFilteredParcels(filtered);
    }, [emailFilter, statusFilter, cityFilter, dateFilter, parcels]);

    const clearFilters = () => {
        setEmailFilter("");
        setStatusFilter("");
        setCityFilter("");
        setDateFilter("");
    };

    return (
        <div className="w-full p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <img 
                        src="/mailbox.png" 
                        alt="All Parcels" 
                        className="w-12 h-12 mr-3"
                    />
                    <h1 className="text-3xl font-bold">All Parcels</h1>
                </div>
                <button
                    onClick={fetchAllParcels}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Refresh
                </button>
            </div>

            {/* Filters */}
            {loaded && parcels.length > 0 && (
                <div className="flex flex-wrap gap-4 mb-6 justify-center items-center bg-gray-50 p-4 rounded-lg shadow">
                    <input
                        type="text"
                        placeholder="Filter by Email"
                        value={emailFilter}
                        onChange={(e) => setEmailFilter(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                    <input
                        type="text"
                        placeholder="Filter by City"
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg w-44 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
            {loaded && parcels.length > 0 && (
                <div className="text-center mb-4">
                    <p className="text-gray-600">
                        Showing {filteredParcels.length} of {parcels.length} parcels
                    </p>
                </div>
            )}

            {/* Parcel Table */}
            {loaded && filteredParcels.length > 0 && (
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

            {/* No Parcels Found */}
            {loaded && filteredParcels.length === 0 && parcels.length > 0 && (
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

            {/* No Parcels */}
            {loaded && parcels.length === 0 && (
                <div className="text-center mt-8">
                    <img 
                        src="/paper.png" 
                        alt="No parcels" 
                        className="w-24 h-24 mx-auto mb-4 opacity-50"
                    />
                    <p className="text-gray-500 text-lg font-medium">
                        No parcels found.
                    </p>
                </div>
            )}

            {/* Loader */}
            {!loaded && (
                <div className="w-full h-full flex items-center justify-center py-20">
                    <VscLoading className="text-[60px] animate-spin text-blue-600" />
                </div>
            )}
        </div>
    );
}
