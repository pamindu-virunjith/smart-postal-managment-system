import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { MdOutlineDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { VscLoading } from "react-icons/vsc";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react"; // ✅ Import QR code generator

export default function ParcelPage() {
  const [parcels, setParcels] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null); // ✅ Track selected parcel for QR
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
          console.log(response.data);
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
      setLoaded(false); // Reset loaded state to refetch products
      toast.success("Parcel deleted successfully!");
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Failed to delete Parcel. Please try again."
      );
    }
  }

  // ✅ Function to convert parcel details into QR code JSON
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
    <div className="w-full h-full rounded-lg p-1 relative">
      <Link
        to={"/admin/addparcel"}
        className="text-white bg-blue-500 hover:bg-blue-600 p-2 text-3xl rounded-full mb-4 flex items-center gap-2 absolute bottom-4 right-4"
      >
        <FaPlus />
      </Link>

      {loaded && (
        <table className="w-full">
          <thead>
            <tr className="text-center ">
              <th className="p-2">Parcel ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">E-mail</th>
              <th className="p-2">Address</th>
              <th className="p-2">Details</th>
              <th className="p-2">Estimate Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => {
              return (
                <tr
                  key={index}
                  className="text-center border-b cursor-pointer hover:bg-gray-100"
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
                    <div className="w-full h-full flex justify-center gap-2">
                      <MdOutlineDeleteOutline
                        onClick={() => {
                          deleteParcel(parcel.parcelID);
                        }}
                        className="text-[25px] hover:text-red-600"
                      />
                      <MdOutlineEdit
                        onClick={() => {
                          navigate("/admin/editparcel/", {
                            state: parcel,
                          });
                        }}
                        className="text-[25px] hover:text-blue-600"
                      />
                      {/* ✅ QR Button */}
                      <button
                        onClick={() => setSelectedParcel(parcel)}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                      >
                        QR
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {!loaded && (
        <div className="w-full h-full flex items-center justify-center">
          <VscLoading className="text-[60px] animate-spin" />
        </div>
      )}

      {/* ✅ QR Code Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg text-center">
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
