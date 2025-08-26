import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitRepairRequest, fetchUserByUsername } from '../api/repairRequestApi';
import Brand from '../brand';

const RepairRequestForm = () => {
  const navigate = useNavigate();

  const [usernameInput, setUsernameInput] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    equipmentType: 'cricket_bat',
    damageType: '',
    damageDescription: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BACKEND_DAMAGE_TYPES = [
    'Bat Handle Damage',
    'Bat Surface Crack',
    'Ball Stitch Damage',
    'Gloves Tear',
    'Pads Crack',
    'Helmet Damage',
    'Other'
  ];

  const handleUsernameCheck = async () => {
    setLookupError('');
    setApiError('');
    const username = usernameInput.trim();
    if (!username) {
      setLookupError('Please enter your username');
      return;
    }
    setLookupLoading(true);
    try {
      const data = await fetchUserByUsername(username);
      const user = data.user || data || {};
      const id = user.id || user._id || user.userId || user.customerId || null;
      const name = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || '';
      const email = user.email || user.mail || '';
      const phone = user.phone || user.contactNumber || user.mobile || '';
      const address = user.address || user.location || '';

      if (!id || !email) throw new Error('notfound');

      const normalized = { id, name, email, phone, address, username };
      setCurrentUser(normalized);
      try { localStorage.setItem('cx_current_user', JSON.stringify(normalized)); } catch {}
    } catch (err) {
      setLookupError('No user found with that username or name. Please check and try again.');
      setCurrentUser(null);
    } finally {
      setLookupLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const hasNumbers = (text) => /\d/.test(text);
  const hasRepeatedLetters = (text) => /(.)\1\1/.test(text);

  const validateForm = () => {
    const next = {};
    if (!currentUser) next.currentUser = 'Please validate your username first.';

    if (!formData.damageType) next.damageType = 'Please select damage type';

    const desc = (formData.damageDescription || '').trim();
    if (!desc) next.damageDescription = 'Damage description is required';
    else if (desc.length < 10) next.damageDescription = 'Description must be at least 10 characters';
    else if (desc.length > 300) next.damageDescription = 'Description must be 300 characters or less';
    else if (hasNumbers(desc)) next.damageDescription = 'Description cannot contain numbers';
    else if (hasRepeatedLetters(desc)) next.damageDescription = 'Avoid repeating the same character 3+ times in a row';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const [firstName, ...rest] = (currentUser?.name || '').split(' ');
      const lastName = rest.join(' ').trim();
      const payload = {
        customerId: currentUser?.id,
        equipmentType: formData.equipmentType,
        username: currentUser?.username,
        firstName: firstName || currentUser?.name || '',
        lastName: lastName || '',
        contactNumber: currentUser?.phone || '',
        address: currentUser?.address || '',
        damageType: formData.damageType,
        description: formData.damageDescription.trim(),
        status: 'Pending'
      };

      const response = await submitRepairRequest(payload);

      const created = response?.data?.repairRequest;
      const ok = (response?.status === 201) || !!created;
      if (ok) {
        navigate(`/dashboard/${currentUser.id}`);
      } else {
        setApiError(response?.data?.error || response?.data?.message || 'Failed to submit repair request.');
      }
    } catch (error) {
      const msg = error?.response?.data?.error || error?.response?.data?.message || error?.message || 'Submission failed.';
      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modal close handler
  const closeModal = () => {
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl" style={{ border: `2px solid ${Brand.secondary}` }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: Brand.light }}>
          <h1 className="text-xl font-bold" style={{ color: Brand.primary }}>🏏 Cricket Equipment Repair Request</h1>
          <div className="flex items-center gap-3">
            {currentUser?.id && (
              <button
                type="button"
                onClick={() => navigate(`/dashboard/${currentUser.id}`)}
                className="px-3 py-1 rounded-lg text-white text-sm"
                style={{ backgroundColor: Brand.secondary }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = Brand.primaryHover; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = Brand.secondary; }}
              >
                My Requests
              </button>
            )}
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">×</button>
          </div>
        </div>

        <div className="px-6 py-4">
          {!currentUser && (
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4 border" style={{ borderColor: Brand.secondary }}>
                <label className="block text-sm font-medium mb-2" style={{ color: Brand.body }}>Enter your Username or Name</label>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none"
                    style={{ borderColor: Brand.secondary }}
                    placeholder="e.g., john_smith or John Smith"
                  />
                  <button
                    type="button"
                    onClick={handleUsernameCheck}
                    disabled={lookupLoading}
                    className="px-4 py-2 rounded-lg text-white font-semibold"
                    style={{ backgroundColor: Brand.secondary }}
                  >
                    {lookupLoading ? 'Checking...' : 'Continue'}
                  </button>
                </div>
                {lookupError && <p className="text-red-500 text-sm mt-2">{lookupError}</p>}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3" style={{ color: Brand.primary }}>Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: Brand.body }}>Full Name</label>
                  <input type="text" value={currentUser?.name || ''} readOnly disabled className={`w-full px-3 py-2 border rounded-lg bg-gray-100 ${errors.customerName ? 'border-red-500' : 'border-gray-300'}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: Brand.body }}>Email Address</label>
                  <input type="email" value={currentUser?.email || ''} readOnly disabled className={`w-full px-3 py-2 border rounded-lg bg-gray-100 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: Brand.body }}>Phone Number</label>
                  <input type="tel" value={currentUser?.phone || ''} readOnly disabled className={`w-full px-3 py-2 border rounded-lg bg-gray-100 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: Brand.body }}>Customer ID</label>
                  <input type="text" value={currentUser?.id || ''} readOnly disabled className="w-full px-3 py-2 border rounded-lg bg-gray-100 border-gray-300" />
                </div>
              </div>
              {errors.currentUser && <p className="text-red-500 text-sm mt-2">{errors.currentUser}</p>}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3" style={{ color: Brand.primary }}>Equipment & Damage Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: Brand.body }}>Equipment Type</label>
                  <select name="equipmentType" value={formData.equipmentType} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2">
                    <option value="cricket_bat">Cricket Bat</option>
                    <option value="cricket_ball">Cricket Ball</option>
                    <option value="cricket_gloves">Cricket Gloves</option>
                    <option value="cricket_pads">Cricket Pads</option>
                    <option value="cricket_helmet">Cricket Helmet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: Brand.body }}>Damage Type *</label>
                  <select name="damageType" value={formData.damageType} onChange={handleInputChange} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.damageType ? 'border-red-500' : 'border-gray-300'}`} aria-invalid={!!errors.damageType}>
                    <option value="">Select damage type (must match)</option>
                    {BACKEND_DAMAGE_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.damageType && <p className="text-red-500 text-sm mt-1">{errors.damageType}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: Brand.body }}>Damage Description *</label>
                  <textarea
                    name="damageDescription"
                    value={formData.damageDescription}
                    onChange={handleInputChange}
                    rows="4"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.damageDescription ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Describe the damage (10-300 chars, no numbers, avoid aaa, bbb, etc.)"
                    aria-invalid={!!errors.damageDescription}
                  />
                  {errors.damageDescription && <p className="text-red-500 text-sm mt-1">{errors.damageDescription}</p>}
                </div>
              </div>
            </div>

            {apiError && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FEE2E2', border: '1px solid #EF4444', color: '#991B1B' }}>
                {apiError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 px-1 pb-4">
              <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border" style={{ borderColor: Brand.secondary, color: Brand.body }}>Cancel</button>
              <button type="submit" disabled={isSubmitting || !currentUser} className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors ${isSubmitting || !currentUser ? 'opacity-50 cursor-not-allowed' : ''}`} style={{ backgroundColor: Brand.secondary }} onMouseOver={(e) => { if(!(isSubmitting || !currentUser)) e.currentTarget.style.backgroundColor = Brand.primaryHover; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = Brand.secondary; }}>
                {isSubmitting ? 'Submitting...' : 'Submit Repair Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RepairRequestForm;
