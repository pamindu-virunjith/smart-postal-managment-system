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
    const [address, setAddress] = useState(locationData.state.address);
    const [details, setDetails] = useState(locationData.state.details);
    const [estimateDate, setEstimateDate] = useState(locationData.state.estimateDate);
    const [status, setStatus] = useState(locationData.state.status);

    async function handleEditParcel() {
        const updatedParcel = {
            parcelID: parcelID,
            name: name,
            email: email,
            address: address,
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
            navigate("/postman/parcel");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to edit parcel.");
            console.error(error);
        }
    }

    return (
        <div className="w-full h-full rounded-lg p-4 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-center mb-4">Edit Parcel</h1>
            <div className="w-[500px] shadow-xl rounded-lg flex flex-col items-center justify-center bg-gray-200 p-4">
                <input
                    disabled
                    value={parcelID}
                    onChange={(e) => setParcelID(e.target.value)}
                    className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[10px]"
                    type="text"
                    placeholder="Parcel ID"
                />
                <input
                    disabled
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[10px]"
                    type="text"
                    placeholder="Name"
                />
                <input
                    disabled
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[10px]"
                    type="email"
                    placeholder="E-mail"
                />
                <textarea
                    disabled
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-[400px] h-[70px] border border-gray-500 rounded-xl text-center m-[10px]"
                    type="text"
                    placeholder="Address"
                />
                <textarea
                    disabled
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-[400px] h-[100px] border border-gray-500 rounded-xl text-center m-[10px]"
                    placeholder="Details"
                />
                <input
                    disabled
                    value={estimateDate}
                    onChange={(e) => setEstimateDate(e.target.value)}
                    className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[10px]"
                    
                />
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[10px]"
                >
                    <option value="" disabled>Select status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                </select>
                <button
                    onClick={handleEditParcel}
                    className="w-[400px] h-[50px] bg-green-500 text-white rounded-xl text-center mt-[20px] cursor-pointer"
                >
                    Edit Parcel
                </button>
                <Link
                    to={"/postman/parcel"}
                    className="w-[400px] h-[50px] bg-red-500 text-white rounded-xl text-center m-[10px] flex items-center justify-center"
                >
                    Cancel
                </Link>
            </div>
        </div>
    );
}