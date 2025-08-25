import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCustomerRequestsById,
  updateRepairRequest,
  deleteRepairRequest,
  downloadRepairPDF,
} from "../api/repairRequestApi";

const RepairRequestCard = ({ request, onUpdate, onDelete, onDownload }) => (
  <div className="bg-lightBg p-4 rounded-xl shadow mb-4">
    <h3 className="text-xl font-bold text-primary mb-2">{request.damageType || "N/A"}</h3>
    <p><strong>Status:</strong> {request.status || "Pending"}</p>
    <p><strong>Progress:</strong> {request.repairProgress ?? 0}%</p>
    <p><strong>Current Stage:</strong> {request.currentStage || "Not started"}</p>
    {request.costEstimate && <p><strong>Cost:</strong> {request.costEstimate}</p>}
    {request.timeEstimate && <p><strong>Time Estimate:</strong> {request.timeEstimate}</p>}
    <div className="mt-2 flex gap-2">
      <button
        onClick={() => onUpdate(request)}
        className="bg-secondaryBtn text-white py-1 px-3 rounded hover:bg-secondaryBtnHover transition"
      >
        Update
      </button>
      <button
        onClick={() => onDelete(request._id)}
        className="bg-primary text-white py-1 px-3 rounded hover:bg-primaryHover transition"
      >
        Delete
      </button>
      <button
        onClick={() => onDownload(request._id)}
        className="bg-secondary text-white py-1 px-3 rounded hover:bg-primaryHover transition"
      >
        Download PDF
      </button>
    </div>
  </div>
);

const CustomerDashboard = () => {
  const { customerId } = useParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch customer requests
  const fetchRequests = async () => {
    setLoading(true);
    setMessage("");
    try {
      if (!customerId) {
        setMessage("Customer ID not found in URL.");
        return;
      }

      const res = await getCustomerRequestsById(customerId);
      setRequests(res.data || []);
      if (!res.data || res.data.length === 0) {
        setMessage("No repair requests submitted yet.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error fetching requests");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (request) => {
    const newDamageType = prompt("Enter new damage type:", request.damageType);
    if (!newDamageType) return;
    try {
      await updateRepairRequest(request._id, { damageType: newDamageType });
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Error updating request");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await deleteRepairRequest(id);
      fetchRequests();
    } catch (err) {
      console.error(err);
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
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Error downloading PDF");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [customerId]);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold text-primary mb-6">My Repair Requests</h2>

      {loading && <p className="text-body">Loading...</p>}

      {!loading && message && <p className="text-body">{message}</p>}

      {!loading && !message && requests.length > 0 && requests.map((req) => (
        <RepairRequestCard
          key={req._id}
          request={req}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />
      ))}
    </div>
  );
};

export default CustomerDashboard;
