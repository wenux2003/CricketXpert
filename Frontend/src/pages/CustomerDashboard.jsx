import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RepairRequestCard from "../components/RepairRequestCard";
import {
  getCustomerRequestsById,
  updateRepairRequest,
  deleteRepairRequest,
  downloadRepairPDF,
  customerDecision, // ✅ new
} from "../api/repairRequestApi";

const STATUS_GROUPS = [
  "Pending",
  "Approved",
  "Rejected",
  "Estimate Sent",
  "Customer Approved",
  "Customer Rejected",
  "In Progress",
  "Completed",
];
const DAMAGE_TYPES = [
  "Bat Handle Damage",
  "Bat Surface Crack",
  "Ball Stitch Damage",
  "Gloves Tear",
  "Pads Crack",
  "Helmet Damage",
  "Other",
];
const ITEMS_PER_PAGE = 5;

const CustomerDashboard = () => {
  const { customerId } = useParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [newDamageType, setNewDamageType] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await getCustomerRequestsById(customerId);
      setRequests(res.data);
      if (res.data.length === 0) setMessage("No repair requests submitted yet.");
    } catch {
      setMessage("Error fetching requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [customerId]);

  // Filter & search
  const filteredRequests = requests.filter((r) => {
    const damageType = r.damageType || "";
    const description = r.description || "";
    const matchesSearch =
      damageType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const displayedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const openEditModal = (request) => {
    setEditingRequest(request);
    setNewDamageType(request.damageType);
    setNewDescription(request.description);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!newDamageType || !newDescription.trim())
      return alert("Both fields are required.");
    try {
      await updateRepairRequest(editingRequest._id, {
        damageType: newDamageType,
        description: newDescription,
      });
      setIsModalOpen(false);
      setEditingRequest(null);
      fetchRequests();
    } catch {
      alert("Error updating request");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await deleteRepairRequest(id);
      fetchRequests();
    } catch {
      alert("Error deleting request");
    }
  };

  const handleDownload = async (id) => {
    try {
      const res = await downloadRepairPDF(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `repair_report_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch {
      alert("Error downloading PDF");
    }
  };

  // ✅ New: customer decision (accept/reject estimate)
  const handleDecision = async (id, decision) => {
    try {
      await customerDecision(id, decision);
      fetchRequests();
    } catch {
      alert("Error sending decision");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-[#072679] mb-6 text-center">
        My Repair Requests
      </h2>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by damage type or description"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1 p-3 border border-[#36516C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="p-3 border border-[#36516C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
        >
          <option value="All">All Statuses</option>
          {STATUS_GROUPS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-[#36516C]">Loading...</p>
      ) : message ? (
        <p className="text-[#36516C]">{message}</p>
      ) : filteredRequests.length === 0 ? (
        <p className="text-[#36516C]">
          No requests match your search/filter criteria.
        </p>
      ) : (
        <>
          {STATUS_GROUPS.map((status) => {
            const groupRequests = filteredRequests.filter(
              (r) => r.status === status
            );
            if (groupRequests.length === 0) return null;
            return (
              <div key={status} className="mb-8">
                <h3 className="text-xl font-semibold text-[#42ADF5] mb-3">
                  {status} Requests
                </h3>
                {groupRequests.map((req) => (
                  <div key={req._id} className="mb-4">
                    <RepairRequestCard
                      request={req}
                      onUpdate={() => openEditModal(req)}
                      onDelete={() => handleDelete(req._id)}
                      onDownload={() => handleDownload(req._id)}
                    />

                    {/* ✅ Show Accept/Reject if estimate was sent */}
                    {req.status === "Estimate Sent" && (
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleDecision(req._id, "approve")}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Accept Estimate
                        </button>
                        <button
                          onClick={() => handleDecision(req._id, "reject")}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Reject Estimate
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-[#42ADF5] text-white rounded hover:bg-[#2C8ED1] transition"
              >
                Previous
              </button>
              <span className="text-[#072679] font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-[#42ADF5] text-white rounded hover:bg-[#2C8ED1] transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold text-[#072679] mb-4">
              Edit Repair Request
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block mb-1 font-medium text-[#072679]">
                  Damage Type
                </label>
                <select
                  value={newDamageType}
                  onChange={(e) => setNewDamageType(e.target.value)}
                  className="w-full p-2 border border-[#36516C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
                >
                  {DAMAGE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-[#072679]">
                  Description
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full p-2 border border-[#36516C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-[#42ADF5] text-white rounded hover:bg-[#2C8ED1] transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
