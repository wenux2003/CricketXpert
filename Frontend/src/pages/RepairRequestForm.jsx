import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserByUsername } from "../api/userApi";
import { submitRepairRequest } from "../api/repairRequestApi";

// Updated damage types matching backend enum
const DAMAGE_TYPES = [
  "Bat Handle Damage",
  "Bat Surface Crack",
  "Ball Stitch Damage",
  "Gloves Tear",
  "Pads Crack",
  "Helmet Damage",
  "Other"
];

const RepairRequestForm = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [user, setUser] = useState(null);
  const [damageType, setDamageType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleUsernameCheck = async () => {
    if (!usernameInput.trim()) return setMessage("Enter a username");
    setLoading(true);
    setMessage("");
    try {
      const res = await getUserByUsername(usernameInput.trim());
      setUser(res);
    } catch {
      setMessage("User not found! Please register first.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setMessage("Enter a valid registered username first.");
    if (!damageType) return setMessage("Select a damage type.");
    if (!description.trim()) return setMessage("Enter a valid description.");

    setLoading(true);
    setMessage("");

    try {
      await submitRepairRequest({
        customerId: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        contactNumber: user.contactNumber,
        address: user.address,
        damageType,
        description,
      });
      setMessage("Repair request submitted successfully!");
      navigate(`/dashboard/${user._id}`);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#F1F2F7] p-6 rounded-xl shadow-md mt-10 border-2 border-[#42ADF5]">
      <h2 className="text-2xl font-bold text-[#072679] mb-4 text-center">
        Cricket Equipment Repair
      </h2>

      {!user ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your registered username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="w-full p-3 border border-[#36516C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
          />
          <button
            onClick={handleUsernameCheck}
            disabled={loading}
            className="w-full bg-[#42ADF5] text-white py-2 rounded-xl font-medium hover:bg-[#2C8ED1] transition"
          >
            {loading ? "Checking..." : "Check Username"}
          </button>
          {message && <p className="text-[#36516C] mt-2">{message}</p>}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info */}
          <input type="text" value={user.firstName} disabled className="w-full p-2 border border-[#36516C] rounded-md bg-gray-100" />
          <input type="text" value={user.lastName} disabled className="w-full p-2 border border-[#36516C] rounded-md bg-gray-100" />
          <input type="text" value={user.contactNumber} disabled className="w-full p-2 border border-[#36516C] rounded-md bg-gray-100" />
          <input type="text" value={user.address} disabled className="w-full p-2 border border-[#36516C] rounded-md bg-gray-100" />

          {/* Damage Type Dropdown */}
          <div>
            <label className="block text-[#072679] font-semibold mb-1">Damage Type</label>
            <select
              value={damageType}
              onChange={(e) => setDamageType(e.target.value)}
              className="w-full p-3 border border-[#36516C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
              required
            >
              <option value="">-- Select Damage Type --</option>
              {DAMAGE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-[#072679] font-semibold mb-1">Description</label>
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              className="w-full p-3 border border-[#36516C] rounded-md focus:outline-none focus:ring-2 focus:ring-[#42ADF5]"
              placeholder="Describe the damage"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D88717] text-white py-2 rounded-xl font-medium hover:bg-[#B56D13] transition"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>

          {message && <p className="mt-3 text-[#36516C]">{message}</p>}
        </form>
      )}
    </div>
  );
};

export default RepairRequestForm;
