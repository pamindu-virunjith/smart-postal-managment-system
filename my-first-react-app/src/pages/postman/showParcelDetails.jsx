import { useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdOutlineEdit, MdArrowBack } from "react-icons/md";

export default function ShowParcelDetails() {
    const location = useLocation();
    const [parcel, setParcel] = useState(null);

    useEffect(() => {
        if (location.state) {
            setParcel(location.state);
        }
    }, [location.state]);

    if (!parcel) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                    <img 
                        src="/paper.png" 
                        alt="No data" 
                        className="w-32 h-32 mx-auto mb-6 opacity-50"
                    />
                    <h2 className="text-2xl font-bold text-gray-600 mb-4">No Parcel Data Found</h2>
                    <Link 
                        to="/postman/searchparcels" 
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Back to Search
                    </Link>
                </div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-100 text-green-700";
            case "In Transit":
                return "bg-yellow-100 text-yellow-700";
            default:
                return "bg-red-100 text-red-700";
        }
    };

    return (
        <div className="w-full h-full p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link 
                        to="/postman/showparcels"
                        className="flex items-center text-blue-600 hover:text-blue-800 transition"
                    >
                        <MdArrowBack className="text-xl mr-2" />
                        Back to Parcel List
                    </Link>
                    <div className="flex items-center">
                        <img 
                            src="/postman.jpg" 
                            alt="Parcel Details" 
                            className="w-10 h-10 mr-3 rounded-full object-cover"
                        />
                        <h1 className="text-3xl font-bold text-gray-800">Parcel Details</h1>
                    </div>
                </div>
                <Link
                    to="/postman/editparcel/"
                    state={parcel}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <MdOutlineEdit className="mr-2" />
                    Edit Parcel
                </Link>
            </div>

            {/* Parcel Details Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Parcel ID</label>
                            <p className="text-lg font-semibold text-gray-800">{parcel.parcelID}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">Recipient Name</label>
                            <p className="text-lg text-gray-800">{parcel.name}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">Email</label>
                            <p className="text-lg text-gray-800">{parcel.email}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">Status</label>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(parcel.status)}`}>
                                {parcel.status}
                            </span>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Delivery Address</h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Address Line 1</label>
                            <p className="text-lg text-gray-800">{parcel.address_line1}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">City</label>
                            <p className="text-lg text-gray-800">{parcel.city}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">District</label>
                            <p className="text-lg text-gray-800">{parcel.district}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-600">Estimate Delivery Date</label>
                            <p className="text-lg text-gray-800">
                                {new Date(parcel.estimateDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                {parcel.details && (
                    <div className="mt-6 pt-6 border-t">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Additional Details</h2>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-800">{parcel.details}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
