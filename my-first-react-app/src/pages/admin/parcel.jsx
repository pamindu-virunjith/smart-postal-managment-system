import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { MdOutlineDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { VscLoading } from "react-icons/vsc";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

export default function ParcelPage() {
  const [parcels, setParcels] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);

  // 🔍 Filter states
  const [searchCity, setSearchCity] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchParcelID, setSearchParcelID] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!loaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/parcel", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          setParcels(response.data);
          setLoaded(true);
        })
        .catch(() => {
          toast.error("Failed to fetch parcels");
          setLoaded(true);
        });
    }
  }, [loaded]);

  async function deleteParcel(parcelID) {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        import.meta.env.VITE_BACKEND_URL + "/api/parcel/" + parcelID,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      setLoaded(false);
      toast.success("Parcel deleted successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete Parcel. Please try again."
      );
    }
  }

  // ✅ Function to convert parcel details into QR code JSON
  function generateQRData(parcel) {
    return JSON.stringify({
      parcelID: parcel.parcelID,
      name: parcel.name,
      address_line1: parcel.address_line1,
      city: parcel.city,
      district: parcel.district,
      details: parcel.details,
      estimateDate: parcel.estimateDate,
      status: parcel.status,
    });
  }

  // ✅ Combined filters
  const filteredParcels = parcels.filter((parcel) => {
    const matchesParcelID = parcel.parcelID
      ?.toLowerCase()
      .includes(searchParcelID.toLowerCase());
    const matchesCity = parcel.city
      ?.toLowerCase()
      .includes(searchCity.toLowerCase());
    const matchesEmail = parcel.email
      ?.toLowerCase()
      .includes(searchEmail.toLowerCase());
    const matchesStatus = searchStatus
      ? parcel.status?.toLowerCase() === searchStatus.toLowerCase()
      : true;
    const matchesDate = searchDate
      ? new Date(parcel.estimateDate).toLocaleDateString() ===
        new Date(searchDate).toLocaleDateString()
      : true;

    return matchesCity && matchesEmail && matchesStatus && matchesDate && matchesParcelID;
  });

  return (
    <div className="w-full h-full rounded-xl p-6 bg-gradient-to-br from-gray-100 to-blue-50 relative shadow-lg">
      {/* ➕ Add Parcel Button */}
      <Link
        to={"/admin/addparcel"}
        className="fixed bottom-8 right-8 shadow-xl text-white bg-blue-600 hover:bg-blue-700 p-5 text-3xl rounded-full flex items-center gap-2 transition-all duration-200 border-4 border-white"
        title="Add Parcel"
      >
        <FaPlus />
      </Link>

      {/* 🔍 Filters */}
      <div className="flex justify-center gap-4 my-8 flex-wrap bg-white p-6 rounded-xl shadow-lg border border-blue-100">
        <input
          type="text"
          placeholder="Search by Parcel ID..."
          value={searchParcelID}
          onChange={(e) => setSearchParcelID(e.target.value)}
          className="border border-blue-200 p-3 rounded-lg focus:outline-blue-400 min-w-[180px] shadow-sm"
        />
        <input
          type="text"
          placeholder="Search by email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="border border-blue-200 p-3 rounded-lg focus:outline-blue-400 min-w-[180px] shadow-sm"
        />
        <input
          type="text"
          placeholder="Search by city..."
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          className="border border-blue-200 p-3 rounded-lg focus:outline-blue-400 min-w-[180px] shadow-sm"
        />
        <select
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          className="border border-blue-200 p-3 rounded-lg focus:outline-blue-400 min-w-[150px] shadow-sm"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border border-blue-200 p-3 rounded-lg focus:outline-blue-400 min-w-[150px] shadow-sm"
        />
        <button
          onClick={() => {
            setSearchCity("");
            setSearchEmail("");
            setSearchStatus("");
            setSearchDate("");
            setSearchParcelID("");
          }}
          className="bg-gray-200 hover:bg-gray-300 px-5 py-2 rounded-lg transition-all duration-200 font-semibold text-gray-700 shadow"
        >
          Clear
        </button>
      </div>

      {loaded && (
        <div className="overflow-x-auto mt-6">
          <table className="w-full bg-white rounded-xl shadow-lg border border-blue-100">
            <thead>
              <tr className="text-center bg-blue-200">
                <th className="p-4 font-bold text-blue-700">Parcel ID</th>
                <th className="p-4 font-bold text-blue-700">Name</th>
                <th className="p-4 font-bold text-blue-700">E-mail</th>
                <th className="p-4 font-bold text-blue-700">Address</th>
                <th className="p-4 font-bold text-blue-700">City</th>
                <th className="p-4 font-bold text-blue-700">District</th>
                <th className="p-4 font-bold text-blue-700">Current Location</th>
                <th className="p-4 font-bold text-blue-700">Details</th>
                <th className="p-4 font-bold text-blue-700">Estimate Date</th>
                <th className="p-4 font-bold text-blue-700">Status</th>
                <th className="p-4 font-bold text-blue-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredParcels.map((parcel, index) => (
                <tr
                  key={index}
                  className="text-center border-b border-blue-100 hover:bg-blue-50 transition-all duration-150"
                >
                  <td className="p-4">{parcel.parcelID}</td>
                  <td className="p-4">{parcel.name}</td>
                  <td className="p-4">{parcel.email}</td>
                  <td className="p-4">{parcel.address_line1}</td>
                  <td className="p-4">{parcel.city}</td>
                  <td className="p-4">{parcel.district}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                      {parcel.currentLocation || 'Not Set'}
                    </span>
                  </td>
                  <td className="p-4">{parcel.details}</td>
                  <td className="p-4">
                    {new Date(parcel.estimateDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs font-semibold shadow ${
                        parcel.status === "Delivered"
                          ? "bg-green-500"
                          : parcel.status === "Shipped"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {parcel.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <MdOutlineDeleteOutline
                        onClick={() => deleteParcel(parcel.parcelID)}
                        className="text-[22px] hover:text-red-600 cursor-pointer transition-all duration-150"
                        title="Delete"
                      />
                      <MdOutlineEdit
                        onClick={() =>
                          navigate("/admin/editparcel/", { state: parcel })
                        }
                        className="text-[22px] hover:text-blue-600 cursor-pointer transition-all duration-150"
                        title="Edit"
                      />
                      <button
                        onClick={() => setSelectedParcel(parcel)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150 shadow"
                        title="Show QR"
                      >
                        QR
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loaded && (
        <div className="w-full h-full flex items-center justify-center">
          <VscLoading className="text-[60px] animate-spin text-blue-500" />
        </div>
      )}

      {loaded && filteredParcels.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-lg font-semibold">
          No parcels found for these filters.
        </p>
      )}

      {/* ✅ QR Code Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-red-100 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-10 rounded-xl text-center shadow-2xl relative min-w-[340px] border-2 border-blue-200">
            <h2 className="text-2xl font-bold mb-6 text-blue-600">Parcel QR Code</h2>
            <QRCodeCanvas value={generateQRData(selectedParcel)} size={220} />
            <div className="mt-8 flex gap-6 justify-center">
              <button
                onClick={() => setSelectedParcel(null)}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg font-semibold transition-all duration-150 shadow"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const canvas = document.querySelector("canvas");
                  const url = canvas.toDataURL("image/png");
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `parcel-${selectedParcel.parcelID}.png`;
                  a.click();
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold transition-all duration-150 shadow"
              >
                Download
              </button>
            </div>
          </div>
        </div>  
      )}
    </div>
  );
}