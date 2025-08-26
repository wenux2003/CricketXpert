import { useEffect, useState } from "react";
import { getAllRepairRequests, updateRepairRequest, getAllTechnicians, assignTechnician } from "../api/repairRequestApi";

const STATUS_GROUPS = ["Pending", "Approved", "Rejected", "Estimate Sent", "Customer Approved", "Customer Rejected"];

const ServiceManagerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  // Modal state for cost & time
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [cost, setCost] = useState("");
  const [duration, setDuration] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const resRequests = await getAllRepairRequests();
      const resTechnicians = await getAllTechnicians();
      setRequests(resRequests.data);
      setTechnicians(resTechnicians.data);
      if (resRequests.data.length === 0) setMessage("No repair requests available.");
    } catch {
      setMessage("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter requests by search term
  const filteredRequests = requests.filter(req => 
    req.customerId.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.damageType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (request) => {
    setSelectedRequest(request);
    setCost("");
    setDuration("");
    setIsModalOpen(true);
  };

  const handleReject = async (requestId) => {
    await updateRepairRequest(requestId, { status: "Rejected" });
    fetchData();
  };

  const submitEstimate = async () => {
    if (!cost || !duration) return alert("Please enter both cost and duration.");
    await updateRepairRequest(selectedRequest._id, {
      status: "Estimate Sent",
      cost,
      duration,
    });
    setIsModalOpen(false);
    setSelectedRequest(null);
    fetchData();
  };

  const handleAssignTechnician = async (requestId, techId) => {
    await assignTechnician(requestId, techId);
    fetchData();
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-center text-[#072679] mb-6">Service Manager Dashboard</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by customer or damage type"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-3 border border-[#36516C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
        />
      </div>

      {loading ? (
        <p className="text-[#36516C]">Loading...</p>
      ) : message ? (
        <p className="text-[#36516C]">{message}</p>
      ) : (
        STATUS_GROUPS.map((status) => {
          const groupRequests = filteredRequests.filter(r => r.status === status);
          if (groupRequests.length === 0) return null;

          return (
            <div key={status} className="mb-8">
              <h3 className="text-xl font-semibold text-[#42ADF5] mb-3">{status} Requests</h3>
              {groupRequests.map((req) => (
                <div key={req._id} className="p-4 border rounded-md mb-3 bg-white shadow-md">
                  <p><strong>Customer:</strong> {req.customerId.username} ({req.customerId.email})</p>
                  <p><strong>Damage Type:</strong> {req.damageType}</p>
                  <p><strong>Description:</strong> {req.description}</p>
                  {req.status === "Estimate Sent" && (
                    <>
                      <p><strong>Cost:</strong> ${req.cost}</p>
                      <p><strong>Duration:</strong> {req.duration} days</p>
                      <div className="mt-2">
                        <select
                          value={req.technicianId?._id || ""}
                          onChange={(e) => handleAssignTechnician(req._id, e.target.value)}
                          className="px-2 py-1 border rounded"
                        >
                          <option value="">Assign Technician</option>
                          {technicians.map(t => (
                            <option key={t._id} value={t._id}>{t.technicianId.username}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                  <div className="mt-2 flex gap-2">
                    {status === "Pending" && (
                      <>
                        <button onClick={() => handleApprove(req)} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
                          Approve
                        </button>
                        <button onClick={() => handleReject(req._id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })
      )}

      {/* Modal for cost & time */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold text-[#072679] mb-4">Enter Cost & Duration</h3>
            <div className="space-y-3">
              <div>
                <label className="block mb-1 font-medium text-[#072679]">Cost ($)</label>
                <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className="w-full p-2 border border-[#36516C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#42ADF5]" />
              </div>
              <div>
                <label className="block mb-1 font-medium text-[#072679]">Duration (days)</label>
                <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full p-2 border border-[#36516C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#42ADF5]" />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={submitEstimate} className="px-4 py-2 bg-[#42ADF5] text-white rounded hover:bg-[#2C8ED1] transition">Submit</button>
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagerDashboard;
