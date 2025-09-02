import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
    const [isGeneratingID, setIsGeneratingID] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        generateParcelID();
    }, []);

    const generateParcelID = async () => {
        try {
            const token = localStorage.getItem("token");
            
            // Fetch existing parcels to determine the next ID
            const response = await axios.get(
                import.meta.env.VITE_BACKEND_URL + "/api/parcel",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const existingParcels = response.data;
            
            // Extract parcel numbers from existing IDs and find the highest number
            let highestNumber = 0;
            existingParcels.forEach(parcel => {
                if (parcel.parcelID && parcel.parcelID.startsWith('P')) {
                    const numberPart = parseInt(parcel.parcelID.substring(1));
                    if (!isNaN(numberPart) && numberPart > highestNumber) {
                        highestNumber = numberPart;
                    }
                }
            });

            // Generate next ID with format P000
            const nextNumber = highestNumber + 1;
            const newParcelID = `P${nextNumber.toString().padStart(3, '0')}`;
            
            setParcelID(newParcelID);
            setIsGeneratingID(false);
        } catch (error) {
            console.error("Error generating parcel ID:", error);
            // Fallback: generate a random ID if API call fails
            const randomNumber = Math.floor(Math.random() * 1000) + 1;
            const fallbackID = `P${randomNumber.toString().padStart(3, '0')}`;
            setParcelID(fallbackID);
            setIsGeneratingID(false);
            toast.error("Could not fetch existing parcels, generated random ID");
        }
    };

    async function handleAddParcel() {
        // Validation
        if (!parcelID || !name || !email || !address_line1 || !city || !district || !details || !status) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const parcel = {
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
            await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/parcel",
                parcel,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            toast.success("Parcel added successfully!");
            navigate("/admin/parcel");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add parcel.");
            console.error("Error adding parcel:", error);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-8 drop-shadow-lg">Add Parcel</h1>
            <div className="w-full max-w-lg shadow-2xl rounded-2xl flex flex-col items-center bg-white p-8">
                <div className="w-full mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parcel ID (Auto-generated)
                    </label>
                    <input
                        value={isGeneratingID ? "Generating..." : parcelID}
                        readOnly
                        className="w-full h-12 border border-gray-300 rounded-lg px-4 bg-gray-100 text-gray-600 focus:outline-none cursor-not-allowed"
                        type="text"
                        placeholder="Auto-generated Parcel ID"
                    />
                </div>
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