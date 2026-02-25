import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiDownload, FiFileText, FiCalendar, FiPackage } from "react-icons/fi";

export default function ReportPage() {
    const [parcels, setParcels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [dateFilter, setDateFilter] = useState({
        from: "",
        to: ""
    });
    const [statusFilter, setStatusFilter] = useState("");
    const [filteredParcels, setFilteredParcels] = useState([]);

    useEffect(() => {
        fetchParcels();
    }, []);

    useEffect(() => {
        const filterParcels = () => {
            let filtered = [...parcels];

            // Filter by status
            if (statusFilter) {
                filtered = filtered.filter(parcel => parcel.status === statusFilter);
            }

            // Filter by date range
            if (dateFilter.from) {
                filtered = filtered.filter(parcel => {
                    const parcelDate = new Date(parcel.estimateDate);
                    const fromDate = new Date(dateFilter.from);
                    return parcelDate >= fromDate;
                });
            }

            if (dateFilter.to) {
                filtered = filtered.filter(parcel => {
                    const parcelDate = new Date(parcel.estimateDate);
                    const toDate = new Date(dateFilter.to);
                    return parcelDate <= toDate;
                });
            }

            setFilteredParcels(filtered);
        };

        filterParcels();
    }, [parcels, dateFilter, statusFilter]);

    const fetchParcels = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log("Fetching parcels with token:", token ? "Token present" : "No token");
            
            const response = await axios.get(
                import.meta.env.VITE_BACKEND_URL + "/api/parcel",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            console.log("Parcels fetched successfully:", response.data);
            console.log("Number of parcels:", response.data.length);
            
            setParcels(response.data);
            setLoading(false);
        } catch {
            console.error("Error fetching parcels");
            toast.error("Failed to fetch parcels");
            setLoading(false);
        }
    };

    const testPDFGeneration = () => {
        try {
            console.log("Testing basic PDF generation...");
            const doc = new jsPDF();
            doc.text("Test PDF", 20, 20);
            doc.save("test.pdf");
            toast.success("Test PDF generated successfully!");
        } catch (error) {
            console.error("Test PDF generation failed:", error);
            toast.error("Test PDF generation failed: " + error.message);
        }
    };

    const generatePDFReport = () => {
        setGenerating(true);
        
        try {
            console.log("Starting PDF generation...");
            console.log("Filtered parcels:", filteredParcels);
            
            if (filteredParcels.length === 0) {
                toast.error("No data available to generate report");
                setGenerating(false);
                return;
            }

            const doc = new jsPDF();
            const currentDate = new Date().toLocaleDateString();
            
            console.log("PDF document created successfully");
            
            // Add title and header
            doc.setFontSize(20);
            doc.setTextColor(40, 116, 166);
            doc.text("Smart Postal Management System", 20, 25);
            
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text("Parcel Report", 20, 35);
            
            doc.setFontSize(10);
            doc.text(`Generated on: ${currentDate}`, 20, 45);
            doc.text(`Total Parcels: ${filteredParcels.length}`, 20, 52);

            // Add filters information
            let filterInfo = "Filters Applied: ";
            if (statusFilter) filterInfo += `Status: ${statusFilter}, `;
            if (dateFilter.from) filterInfo += `From: ${dateFilter.from}, `;
            if (dateFilter.to) filterInfo += `To: ${dateFilter.to}, `;
            if (filterInfo === "Filters Applied: ") filterInfo += "None";
            
            doc.text(filterInfo, 20, 59);

            // Status summary
            const statusCounts = filteredParcels.reduce((acc, parcel) => {
                acc[parcel.status] = (acc[parcel.status] || 0) + 1;
                return acc;
            }, {});

            let yPosition = 70;
            doc.setFontSize(12);
            doc.setTextColor(40, 116, 166);
            doc.text("Status Summary:", 20, yPosition);
            
            yPosition += 10;
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            Object.entries(statusCounts).forEach(([status, count]) => {
                doc.text(`${status}: ${count}`, 25, yPosition);
                yPosition += 7;
            });

            console.log("Header and status summary added");

            // Prepare table data with safety checks
            const tableData = filteredParcels.map(parcel => [
                parcel.parcelID || "N/A",
                parcel.name || "N/A",
                parcel.email || "N/A",
                `${parcel.address_line1 || ""}, ${parcel.city || ""}, ${parcel.district || ""}`.replace(/^,\s*|,\s*$/g, '') || "N/A",
                parcel.status || "N/A",
                parcel.estimateDate ? new Date(parcel.estimateDate).toLocaleDateString() : "N/A",
                parcel.details ? (parcel.details.substring(0, 30) + (parcel.details.length > 30 ? "..." : "")) : "N/A"
            ]);

            console.log("Table data prepared:", tableData.length, "rows");

            // Add table using autoTable function directly
            autoTable(doc, {
                head: [['Parcel ID', 'Name', 'Email', 'Address', 'Status', 'Est. Date', 'Details']],
                body: tableData,
                startY: yPosition + 10,
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                },
                headStyles: {
                    fillColor: [40, 116, 166],
                    textColor: [255, 255, 255],
                    fontSize: 9,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                columnStyles: {
                    0: { cellWidth: 25 }, // Parcel ID
                    1: { cellWidth: 25 }, // Name
                    2: { cellWidth: 30 }, // Email
                    3: { cellWidth: 35 }, // Address
                    4: { cellWidth: 20 }, // Status
                    5: { cellWidth: 22 }, // Date
                    6: { cellWidth: 25 }  // Details
                }
            });

            console.log("Table added successfully");

            // Add footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(128, 128, 128);
                doc.text(
                    `Page ${i} of ${pageCount} - Smart Postal Management System`,
                    doc.internal.pageSize.getWidth() / 2,
                    doc.internal.pageSize.getHeight() - 10,
                    { align: 'center' }
                );
            }

            console.log("Footer added successfully");

            // Save the PDF
            const fileName = `postal_report_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
            
            console.log("PDF saved successfully");
            toast.success("Report generated successfully!");
        } catch (error) {
            console.error("Error generating PDF:", error);
            console.error("Error details:", error.message);
            console.error("Error stack:", error.stack);
            toast.error(`Failed to generate report: ${error.message}`);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <FiFileText className="text-3xl text-blue-600 mr-4" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
                            <p className="text-gray-600 mt-1">Generate comprehensive parcel reports</p>
                            <p className="text-sm text-blue-600 mt-1">
                                Loaded: {parcels.length} parcels | Filtered: {filteredParcels.length} parcels
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={generatePDFReport}
                            disabled={generating}
                            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                        >
                            {generating ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                            ) : (
                                <FiDownload className="mr-2" />
                            )}
                            {generating ? "Generating..." : "Generate PDF Report"}
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FiCalendar className="mr-2" />
                        Filters
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                            <input
                                type="date"
                                value={dateFilter.from}
                                onChange={(e) => setDateFilter({...dateFilter, from: e.target.value})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                            <input
                                type="date"
                                value={dateFilter.to}
                                onChange={(e) => setDateFilter({...dateFilter, to: e.target.value})}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setDateFilter({from: "", to: ""});
                                    setStatusFilter("");
                                }}
                                className="w-full px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Total Parcels</p>
                                <p className="text-3xl font-bold">{filteredParcels.length}</p>
                            </div>
                            <FiPackage className="text-2xl opacity-80" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Pending</p>
                                <p className="text-3xl font-bold">
                                    {filteredParcels.filter(p => p.status === "Pending").length}
                                </p>
                            </div>
                            <FiPackage className="text-2xl opacity-80" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">In Transit</p>
                                <p className="text-3xl font-bold">
                                    {filteredParcels.filter(p => p.status === "In Transit").length}
                                </p>
                            </div>
                            <FiPackage className="text-2xl opacity-80" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Delivered</p>
                                <p className="text-3xl font-bold">
                                    {filteredParcels.filter(p => p.status === "Delivered").length}
                                </p>
                            </div>
                            <FiPackage className="text-2xl opacity-80" />
                        </div>
                    </div>
                </div>

                {/* Preview Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">Report Preview</h3>
                        <p className="text-sm text-gray-600">Showing {filteredParcels.length} parcels</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parcel ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredParcels.slice(0, 10).map((parcel, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {parcel.parcelID}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {parcel.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {parcel.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                parcel.status === "Delivered" ? "bg-green-100 text-green-800" :
                                                parcel.status === "In Transit" ? "bg-purple-100 text-purple-800" :
                                                "bg-yellow-100 text-yellow-800"
                                            }`}>
                                                {parcel.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(parcel.estimateDate).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredParcels.length > 10 && (
                            <div className="px-6 py-4 bg-gray-50 text-center">
                                <p className="text-sm text-gray-600">
                                    ... and {filteredParcels.length - 10} more parcels
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
