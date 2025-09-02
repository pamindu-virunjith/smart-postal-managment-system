import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditParcel() {
    const locationData = useLocation();
    const navigate = useNavigate();

    if (!locationData.state) {
        toast.error("No parcel data found to edit.");
        window.location.href = "/postman/parcel";
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
            navigate("/postman/showparceldetails/", { state: updatedParcel });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to edit parcel.");
            console.error(error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100">
            <div className="w-full max-w-lg shadow-2xl rounded-2xl bg-white p-8 flex flex-col items-center">
                <h1 className="text-4xl font-extrabold text-blue-700 mb-8">Edit Parcel</h1>
                <div className="w-full flex flex-col gap-4">
                    <input
                        disabled
                        value={parcelID}
                        onChange={(e) => setParcelID(e.target.value)}
                        className="w-full h-12 border border-gray-300 rounded-lg px-4 bg-gray-100 text-gray-700 font-semibold"
                        type="text"
                        placeholder="Parcel ID"
                    />
                    <input
                        disabled
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-12 border border-gray-300 rounded-lg px-4 bg-gray-100 text-gray-700 font-semibold"
                        type="text"
                        placeholder="Name"
                    />
                    <input
                        disabled
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-12 border border-gray-300 rounded-lg px-4 bg-gray-100 text-gray-700 font-semibold"
                        type="email"
                        placeholder="E-mail"
                    />
                    <textarea
                        disabled
                        value={address_line1}
                        onChange={(e) => setAddress_line1(e.target.value)}
                        className="w-full h-16 border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-700 font-semibold resize-none"
                        type="text"
                        placeholder="Address Line 1"
                    />
                    <input
                        disabled
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-12 border border-gray-300 rounded-lg px-4 bg-gray-100 text-gray-700 font-semibold"
                        type="text"
                        placeholder="City"
                    />
                    <input
                        disabled
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full h-12 border border-gray-300 rounded-lg px-4 bg-gray-100 text-gray-700 font-semibold"
                        type="text"
                        placeholder="District"
                    />
                    <textarea
                        disabled
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="w-full h-20 border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-700 font-semibold resize-none"
                        placeholder="Details"
                    />
                    <input
                        disabled
                        value={estimateDate}
                        onChange={(e) => setEstimateDate(e.target.value)}
                        className="w-full h-12 border border-gray-300 rounded-lg px-4 bg-gray-100 text-gray-700 font-semibold"
                        type="text"
                        placeholder="Estimate Date"
                    />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full h-12 border border-gray-300 rounded-lg px-4 bg-white text-gray-700 font-semibold"
                    >
                        <option value="" disabled>Select status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                    <button
                        onClick={handleEditParcel}
                        className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg mt-4 transition duration-200"
                    >
                        Edit Parcel
                    </button>
                    <Link
                        to={"/postman/showparcels"}
                        className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg flex items-center justify-center transition duration-200"
                    >
                        Cancel
                    </Link>
                </div>
            </div>
        </div>
    );
}