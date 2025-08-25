import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserByUsername } from "../api/userApi";
import { submitRepairRequest } from "../api/repairRequestApi";

const RepairRequestForm = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [damageType, setDamageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Check if username exists
  const handleUsernameCheck = async () => {
    if (!usernameInput.trim()) return setMessage("Enter a username");
    setLoading(true);
    setMessage("");
    try {
      const res = await getUserByUsername(usernameInput.trim());
      setUser(res); // user object returned
      setFirstName(res.firstName || "");
      setLastName(res.lastName || "");
      setContactNumber(res.contactNumber || "");
      setAddress(res.address || "");
    } catch (err) {
      setMessage("User not found! Please register first.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Submit repair request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setMessage("Enter a valid registered username first.");
    setLoading(true);
    setMessage("");

    try {
      // Only send fields expected by schema
      const data = {
        customerId: user._id,
        damageType,
      };

      await submitRepairRequest(data);
      setMessage("Repair request submitted successfully!");
      navigate(`/dashboard/${user._id}`);
    } catch (err) {
      setMessage(err.response?.data?.error || "Error submitting request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-lightBg p-6 rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold text-primary mb-4">Submit Repair Request</h2>

      {!user ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your registered username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="w-full p-2 border border-body rounded-md"
          />
          <button
            onClick={handleUsernameCheck}
            disabled={loading}
            className="w-full bg-secondary text-white py-2 rounded-xl font-medium hover:bg-primaryHover transition"
          >
            {loading ? "Checking..." : "Check Username"}
          </button>
          {message && <p className="text-body mt-2">{message}</p>}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-heading font-medium mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 border border-body rounded-md"
              disabled
            />
          </div>
          <div>
            <label className="block text-heading font-medium mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 border border-body rounded-md"
              disabled
            />
          </div>
          <div>
            <label className="block text-heading font-medium mb-1">Contact Number</label>
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full p-2 border border-body rounded-md"
              disabled
            />
          </div>
          <div>
            <label className="block text-heading font-medium mb-1">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border border-body rounded-md"
              disabled
            />
          </div>
          <div>
            <label className="block text-heading font-medium mb-1">Damage Type</label>
            <input
              type="text"
              value={damageType}
              onChange={(e) => setDamageType(e.target.value)}
              className="w-full p-2 border border-body rounded-md"
              placeholder="Enter damage type"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-white py-2 rounded-xl font-medium hover:bg-primaryHover transition"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
          {message && <p className="mt-3 text-body">{message}</p>}
        </form>
      )}
    </div>
  );
};

export default RepairRequestForm;
