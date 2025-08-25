import React, { useEffect, useState } from 'react';
import { getAllRepairRequests } from '../api/repairApi';
import RepairRequestCard from '../components/RepairRequestCard';

const DashboardTechnician = ({ technicianId }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await getAllRepairRequests({ technicianId });
    setTasks(res.data);
  };

  useEffect(() => { fetchTasks(); }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-brand.heading mb-4">Assigned Tasks</h2>
      {tasks.map((t) => <RepairRequestCard key={t._id} request={t} />)}
    </div>
  );
};

export default DashboardTechnician;
