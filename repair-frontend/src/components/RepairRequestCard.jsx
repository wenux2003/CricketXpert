import { downloadRepairPDF } from "../api/repairRequestApi";

const RepairRequestCard = ({ request, onDelete, onUpdate }) => {

  const handleDownload = async () => {
    const res = await downloadRepairPDF(request._id);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `repair_report_${request._id}.pdf`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="bg-lightBg p-4 rounded-xl shadow mb-4">
      <h3 className="text-xl font-bold text-primary mb-2">{request.damageType}</h3>
      <p><strong>Status:</strong> {request.status}</p>
      <p><strong>Progress:</strong> {request.repairProgress}%</p>
      <p><strong>Current Stage:</strong> {request.currentStage}</p>
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
          className="bg-secondary text-white py-1 px-3 rounded hover:bg-primaryHover"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default RepairRequestCard;
