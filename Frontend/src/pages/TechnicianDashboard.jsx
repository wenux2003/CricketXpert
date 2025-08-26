import { useEffect, useState } from "react";
import { updateRepairProgress, getAllRequests } from "../api/repairRequestApi";

const TechnicianDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getAllRequests();
      const assigned = res.data.filter(r => r.assignedTechnician && r.assignedTechnician._id === "TECHNICIAN_USER_ID"); // replace with login id
      setTasks(assigned);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleProgressChange = async (id, value) => {
    await updateRepairProgress(id, value);
    fetchTasks();
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-center text-[#072679] mb-6">Technician Dashboard</h2>
      {loading ? <p>Loading...</p> :
        tasks.map(t => (
          <div key={t._id} className="border p-4 rounded mb-4 shadow">
            <p><strong>Customer:</strong> {t.customerId.username}</p>
            <p><strong>Damage Type:</strong> {t.damageType}</p>
            <p><strong>Status:</strong> {t.status}</p>
            <p><strong>Current Stage:</strong> {t.currentStage}</p>
            <p>
              <label>Progress: {t.repairProgress}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={t.repairProgress}
                onChange={e => handleProgressChange(t._id, parseInt(e.target.value))}
                className="w-full"
              />
            </p>
          </div>
        ))
      }
    </div>
  );
};

export default TechnicianDashboard;
