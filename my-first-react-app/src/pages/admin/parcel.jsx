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
        });
    }
  }, [loaded]);

  async function deleteParcel(parcelID) {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        import.meta.env.VITE_BACKEND_URL + "/api/parcel/" + parcelID,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
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

  function generateQRData(parcel) {
    return JSON.stringify({
      parcelID: parcel.parcelID,
      name: parcel.name,
      address: parcel.address,
      details: parcel.details,
      estimateDate: parcel.estimateDate,
      status: parcel.status,
    });
  }

  return (
    <div className="w-full h-full rounded-lg p-2 relative">
      {/* Floating Add Button */}
      <Link
        to={"/admin/addparcel"}
        className="fixed bottom-4 right-4 text-white bg-blue-500 hover:bg-blue-600 p-3 text-2xl rounded-full shadow-lg z-50"
      >
        <FaPlus />
      </Link>

      {/* Desktop Table */}
      {loaded && parcels.length > 0 && (
        <div className="hidden lg:block overflow-x-auto rounded-lg shadow">
          <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr className="text-center">
                <th className="p-3">Parcel ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">E-mail</th>
                <th className="p-3">Address</th>
                <th className="p-3">Details</th>
                <th className="p-3">Estimate Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr
                  key={index}
                  className="text-center border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="p-2">{parcel.parcelID}</td>
                  <td className="p-2">{parcel.name}</td>
                  <td className="p-2">{parcel.email}</td>
                  <td className="p-2">{parcel.address}</td>
                  <td className="p-2">{parcel.details}</td>
                  <td className="p-2">
                    {new Date(parcel.estimateDate).toLocaleDateString()}
                  </td>
                  <td className="p-2">{parcel.status}</td>
                  <td className="p-2">
                    <div className="flex justify-center gap-3">
                      <MdOutlineDeleteOutline
                        onClick={() => deleteParcel(parcel.parcelID)}
                        className="text-[22px] hover:text-red-600 cursor-pointer"
                      />
                      <MdOutlineEdit
                        onClick={() => navigate("/admin/editparcel/", { state: parcel })}
                        className="text-[22px] hover:text-blue-600 cursor-pointer"
                      />
                      <button
                        onClick={() => setSelectedParcel(parcel)}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
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

      {/* Mobile Cards */}
      {loaded && parcels.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
          {parcels.map((parcel, index) => (
            <div
              key={index}
              className="bg-white shadow rounded-lg p-4 border border-gray-300 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg text-gray-800">
                  {parcel.name}
                </h2>
                <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded">
                  {parcel.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                <strong>ID:</strong> {parcel.parcelID}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {parcel.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Address:</strong> {parcel.address}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Details:</strong> {parcel.details}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Estimate:</strong>{" "}
                {new Date(parcel.estimateDate).toLocaleDateString()}
              </p>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-3">
                <MdOutlineDeleteOutline
                  onClick={() => deleteParcel(parcel.parcelID)}
                  className="text-[22px] hover:text-red-600 cursor-pointer"
                />
                <MdOutlineEdit
                  onClick={() => navigate("/admin/editparcel/", { state: parcel })}
                  className="text-[22px] hover:text-blue-600 cursor-pointer"
                />
                <button
                  onClick={() => setSelectedParcel(parcel)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  QR
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loader */}
      {!loaded && (
        <div className="w-full h-full flex items-center justify-center">
          <VscLoading className="text-[60px] animate-spin" />
        </div>
      )}

      {/* QR Modal */}
      {selectedParcel && (
        <div className="fixed bg-black/20 inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg text-center w-[90%] md:w-auto">
            <h2 className="text-xl font-bold mb-4">Parcel QR Code</h2>
            <QRCodeCanvas value={generateQRData(selectedParcel)} size={200} />
            <div className="mt-4 flex gap-2 justify-center">
              <button
                onClick={() => setSelectedParcel(null)}
                className="bg-red-500 text-white px-4 py-2 rounded"
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
                className="bg-blue-500 text-white px-4 py-2 rounded"
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
