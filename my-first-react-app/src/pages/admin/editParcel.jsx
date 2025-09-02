import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditParcel() {
    const locationData = useLocation();
    const navigate = useNavigate();

    if (!locationData.state) {
        toast.error("No parcel data found to edit.");
        window.location.href = "/admin/parcel";
    }

    const [parcelID, setParcelID] = useState(locationData.state.parcelID);
    const [name, setName] = useState(locationData.state.name);
    const [email, setEmail] = useState(locationData.state.email);
    const [address_line1, setAddress_line1] = useState(locationData.state.address_line1);
    const [city, setCity] = useState(locationData.state.city);
    const [district, setDistrict] = useState(locationData.state.district);
    const [details, setDetails] = useState(locationData.state.details);
    const [estimateDate, setEstimateDate] = useState(locationData.state.estimateDate);
    const [status, setStatus] = useState(locationData.state.status);

    async function handleEditParcel() {
        const updatedParcel = {
            parcelID: parcelID,
            name: name,
            email: email,
            address_line1: address_line1,
            city: city,
            district: district,
            details: details,
            estimateDate: estimateDate,
            status: status
        };

        const token = localStorage.getItem("token");

        try {
            await axios.put(
                import.meta.env.VITE_BACKEND_URL + "/api/parcel/" + parcelID,
                updatedParcel,
                {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            );
            toast.success("Parcel edited successfully!");
            navigate("/admin/parcel");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to edit parcel.");
            console.error(error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
            <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 flex flex-col items-center">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-6">Edit Parcel</h1>
                <form className="w-full flex flex-col gap-4">
                    <input
                        disabled
                        value={parcelID}
                        onChange={(e) => setParcelID(e.target.value)}
                        className="w-full h-12 border border-gray-300 rounded-lg px-4 bg-gray-100 text-gray-500 font-semibold"
                        type="text"
                        placeholder="Parcel ID"
                    />
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:border-blue-400 focus:outline-none"
                        type="text"
                        placeholder="Name"
                    />
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:border-blue-400 focus:outline-none"
                        type="email"
                        placeholder="E-mail"
                    />
                    <textarea
                        value={address_line1}
                        onChange={(e) => setAddress_line1(e.target.value)}
                        className="w-full h-16 border border-gray-300 rounded-lg px-4 py-2 resize-none focus:border-blue-400 focus:outline-none"
                        placeholder="Address Line 1"
                    />
                    <input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:border-blue-400 focus:outline-none"
                        type="text"
                        placeholder="City"
                    />
                    <input
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:border-blue-400 focus:outline-none"
                        type="text"
                        placeholder="District"
                    />
                    <textarea
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="w-full h-20 border border-gray-300 rounded-lg px-4 py-2 resize-none focus:border-blue-400 focus:outline-none"
                        placeholder="Details"
                    />
                    <input
                        value={estimateDate}
                        onChange={(e) => setEstimateDate(e.target.value)}
                        className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:border-blue-400 focus:outline-none"
                        type="date"
                        placeholder="Estimate Date"
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full h-12 border border-gray-300 rounded-lg px-4 bg-white focus:border-blue-400 focus:outline-none"
                    >
                        <option value="" disabled>Select status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                    <button
                        type="button"
                        onClick={handleEditParcel}
                        className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition duration-200 mt-2"
                    >
                        Edit Parcel
                    </button>
                    <Link
                        to={"/admin/parcel"}
                        className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg flex items-center justify-center transition duration-200"
                    >
                        Cancel
                    </Link>
                </form>
            </div>
        </div>
    );
}