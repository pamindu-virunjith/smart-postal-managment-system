import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddParcel() {
    const [parcelID, setParcelID] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address_line1, setAddress_line1] = useState("");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [details, setDetails] = useState("");
    const [estimateDate, setEstimateDate] = useState("");
    const [status, setStatus] = useState("");

    const navigate = useNavigate();

    async function handleAddParcel() {
        const parcel = {
            parcelID: parcelID,
            name: name,
            email: email,
            address_line1: address_line1                                                                                                                                                        ,
            city: city,
            district: district,
            details: details,
            estimateDate: estimateDate,
            status: status
        };

        const token = localStorage.getItem("token");

        try {
            await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/parcel",
                parcel,
                {
                    headers: {
                        "Authorization": "Bearer " + token,
                    },
                }
            );
            toast.success("Parcel added successfully!");
            navigate("/admin/parcel");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add parcel.");
            console.error(error);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 drop-shadow-lg">Add Parcel</h1>
            <div className="w-full max-w-lg shadow-2xl rounded-2xl flex flex-col items-center bg-white p-8">
                <input
                    value={parcelID}
                    onChange={(e) => setParcelID(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    type="text"
                    placeholder="Parcel ID"
                />
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    type="text"
                    placeholder="Name"
                />
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    type="email"
                    placeholder="E-mail"
                />
                <textarea
                    value={address_line1}
                    onChange={(e) => setAddress_line1(e.target.value)}
                    className="w-full h-16 border border-gray-300 rounded-lg px-4 py-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    placeholder="Address Line 1"
                />
                <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    type="text"
                    placeholder="City"
                />
                <input
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    type="text"
                    placeholder="District"
                />
                <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full h-20 border border-gray-300 rounded-lg px-4 py-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    placeholder="Details"
                />
                <input
                    value={estimateDate}
                    onChange={(e) => setEstimateDate(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    placeholder="Estimate Date"
                    type="date"
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 mb-6 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                >
                    <option value="" disabled>Select status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                </select>

                <button
                    onClick={handleAddParcel}
                    className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg mb-4 transition duration-200 shadow-md"
                >
                    Add Parcel
                </button>
                <Link
                    to={"/admin/parcel"}
                    className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg flex items-center justify-center transition duration-200 shadow-md"
                >
                    Cancel
                </Link>
            </div>
        </div>
    );
}