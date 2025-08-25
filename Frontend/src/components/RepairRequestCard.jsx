import { useState } from "react";
import { downloadRepairPDF } from "../api/repairRequestApi";

const RepairRequestCard = ({ request, onUpdate, onDelete }) => {
  const [loadingDownload, setLoadingDownload] = useState(false);

  const handleDownload = async () => {
    setLoadingDownload(true);
    try {
      const res = await downloadRepairPDF(request._id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `repair_report_${request._id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch {
      alert("Error downloading PDF");
    } finally {
      setLoadingDownload(false);
    }
  };

  return (
    <div className="bg-lightBg p-4 rounded-xl shadow mb-4">
      <h3 className="text-xl font-bold text-primary mb-2">{request.damageType}</h3>
      <p><strong>Description:</strong> {request.description}</p>
      <p><strong>Status:</strong> {request.status}</p>
      <p><strong>Progress:</strong> {request.repairProgress || 0}%</p>
      <p><strong>Current Stage:</strong> {request.currentStage || "Not started"}</p>
      {request.costEstimate && <p><strong>Cost:</strong> {request.costEstimate}</p>}
      {request.timeEstimate && <p><strong>Time Estimate:</strong> {request.timeEstimate}</p>}

      <div className="mt-2 flex gap-2">
        <button
          onClick={() => onUpdate(request)}
          className="bg-secondaryBtn text-white py-1 px-3 rounded hover:bg-secondaryBtnHover"
        >
          Update
        </button>

        <button
          onClick={() => onDelete(request._id)}
          className="bg-primary text-white py-1 px-3 rounded hover:bg-primaryHover"
        >
          Delete
        </button>

        <button
          onClick={handleDownload}
          className="bg-secondary text-white py-1 px-3 rounded hover:bg-primaryHover flex items-center gap-2"
          disabled={loadingDownload}
        >
          {loadingDownload && (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          )}
          {loadingDownload ? "Downloading..." : "Download PDF"}
        </button>
      </div>
    </div>
  );
};

export default RepairRequestCard;
