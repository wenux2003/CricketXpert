import React, { useEffect, useState } from 'react';
import { getAllRepairRequests, getAllTechnicians } from '../api/repairApi';
import RepairRequestCard from '../components/RepairRequestCard';
import TechnicianCard from '../components/TechnicianCard';

const DashboardManager = () => {
  const [requests, setRequests] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    getAllRepairRequests().then(res => setRequests(res.data));
    getAllTechnicians().then(res => setTechnicians(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-brand.heading mb-4">Repair Requests</h2>
      {requests.map(r => <RepairRequestCard key={r._id} request={r} />)}

      <h2 className="text-2xl font-bold text-brand.heading mt-8 mb-4">Technicians</h2>
      {technicians.map(t => <TechnicianCard key={t._id} tech={t} />)}
    </div>
  );
};

export default DashboardManager;
