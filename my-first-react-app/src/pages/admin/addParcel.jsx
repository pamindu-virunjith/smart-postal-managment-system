import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddParcel() {
   const [parcelID, setParcelID] = useState("");
    const [name, setName] = useState("");
    const [NIC, setNIC] = useState("");
    const [details, setDetails] = useState("");
    const navigate = useNavigate();

    async function handleAddParcel() {
        const parcel = {
            parcelID: parcelID,
            name: name,
            NIC: Number(NIC),
            details: details
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
        <div className="w-full h-full rounded-lg p-4 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-center mb-4">Add Parcel</h1>
            <div className="w-[500px] h-auto shadow-xl rounded-lg flex flex-col items-center justify-center bg-gray-200 p-4">
                <input
                    value={parcelID}
                    onChange={(e) => setParcelID(e.target.value)}
                    className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[10px]"
                    type="text"
                    placeholder="Parcel ID"
                />
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[10px]"
                    type="text"
                    placeholder="Name"
                />
                <input
                    value={NIC}
                    onChange={(e) => setNIC(e.target.value)}
                    className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[10px]"
                    type="number"
                    placeholder="NIC"
                />
                <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-[400px] h-[100px] border border-gray-500 rounded-xl text-center m-[10px]"
                    placeholder="Details"
                />
                <button
                    onClick={handleAddParcel}
                    className="w-[400px] h-[50px] bg-green-500 text-white rounded-xl text-center mt-[20px] cursor-pointer"
                >
                    Add Parcel
                </button>
                <Link
                    to={"/admin/parcel"}
                    className="w-[400px] h-[50px] bg-red-500 text-white rounded-xl text-center m-[10px] flex items-center justify-center"
                >
                    Cancel
                </Link>
            </div>
        </div>
    );
}