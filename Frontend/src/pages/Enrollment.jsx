import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Enrollment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const programId = searchParams.get('program');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    emergencyContact: '',
    emergencyPhone: '',
    selectedProgram: programId || '',
    experience: '',
    medicalConditions: '',
    goals: '',
    preferredStartDate: '',
    paymentMethod: 'monthly'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Program data (same as in Program.jsx)
  const programs = [
    {
      id: 1,
      title: "Elite Cricket Academy",
      price: "$299/month",
      duration: "6 months",
      level: "Advanced"
    },
    {
      id: 2,
      title: "Youth Development Program",
      price: "$199/month",
      duration: "3 months",
      level: "Beginner to Intermediate"
    },
    {
      id: 3,
      title: "Weekend Warrior",
      price: "$149/month",
      duration: "Ongoing",
      level: "All Levels"
    },
    {
      id: 4,
      title: "Fast Bowling Specialist",
      price: "$249/month",
      duration: "4 months",
      level: "Intermediate to Advanced"
    },
    {
      id: 5,
      title: "Batting Masterclass",
      price: "$279/month",
      duration: "5 months",
      level: "Intermediate to Advanced"
    },
    {
      id: 6,
      title: "Wicket Keeping Academy",
      price: "$229/month",
      duration: "4 months",
      level: "All Levels"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required';
    if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = 'Emergency phone is required';
    if (!formData.selectedProgram) newErrors.selectedProgram = 'Please select a program';
    if (!formData.preferredStartDate) newErrors.preferredStartDate = 'Preferred start date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get existing enrollments from localStorage
      const existingEnrollments = JSON.parse(localStorage.getItem('userEnrollments') || '[]');
      
      // Create new enrollment
      const newEnrollment = {
        id: Date.now(),
        ...formData,
        enrollmentDate: new Date().toISOString(),
        status: 'pending',
        program: programs.find(p => p.id === parseInt(formData.selectedProgram))
      };
      
      // Add to enrollments
      const updatedEnrollments = [...existingEnrollments, newEnrollment];
      localStorage.setItem('userEnrollments', JSON.stringify(updatedEnrollments));
      
      // Show success message and redirect
      alert('Enrollment submitted successfully! You will be redirected to your profile.');
      navigate('/profile');
      
    } catch (error) {
      alert('Error submitting enrollment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProgramData = programs.find(p => p.id === parseInt(formData.selectedProgram));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Program Enrollment</h1>
          <p className="text-lg text-gray-600">
            Join our cricket coaching programs and take your game to the next level
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrollment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="bg-[#0D13CC] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth *</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your address"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Enter your city"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="bg-[#0D13CC] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                    Emergency Contact
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Name *</label>
                      <input
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent ${errors.emergencyContact ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Emergency contact name"
                      />
                      {errors.emergencyContact && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Phone *</label>
                      <input
                        type="tel"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent ${errors.emergencyPhone ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Emergency contact phone"
                      />
                      {errors.emergencyPhone && <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>}
                    </div>
                  </div>
                </div>

                {/* Program Selection */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="bg-[#0D13CC] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                    Program Selection
                  </h2>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Program *</label>
                    <select
                      name="selectedProgram"
                      value={formData.selectedProgram}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent ${errors.selectedProgram ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Choose a program</option>
                      {programs.map(program => (
                        <option key={program.id} value={program.id}>
                          {program.title} - {program.price} ({program.level})
                        </option>
                      ))}
                    </select>
                    {errors.selectedProgram && <p className="text-red-500 text-sm mt-1">{errors.selectedProgram}</p>}
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Start Date *</label>
                    <input
                      type="date"
                      name="preferredStartDate"
                      value={formData.preferredStartDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent ${errors.preferredStartDate ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.preferredStartDate && <p className="text-red-500 text-sm mt-1">{errors.preferredStartDate}</p>}
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="bg-[#0D13CC] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">4</span>
                    Additional Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Cricket Experience</label>
                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent"
                      >
                        <option value="">Select your experience level</option>
                        <option value="beginner">Beginner (0-1 years)</option>
                        <option value="intermediate">Intermediate (2-5 years)</option>
                        <option value="advanced">Advanced (5+ years)</option>
                        <option value="professional">Professional/Semi-Professional</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Medical Conditions or Injuries</label>
                      <textarea
                        name="medicalConditions"
                        value={formData.medicalConditions}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent"
                        placeholder="Please mention any medical conditions or injuries we should be aware of"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Goals and Expectations</label>
                      <textarea
                        name="goals"
                        value={formData.goals}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#42ADF5] focus:border-transparent"
                        placeholder="What do you hope to achieve through this program?"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="bg-[#0D13CC] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">5</span>
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="monthly"
                        checked={formData.paymentMethod === 'monthly'}
                        onChange={handleInputChange}
                        className="mr-3 text-[#0D13CC] focus:ring-[#42ADF5]"
                      />
                      <span className="text-gray-700">Monthly Payment</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="full"
                        checked={formData.paymentMethod === 'full'}
                        onChange={handleInputChange}
                        className="mr-3 text-[#0D13CC] focus:ring-[#42ADF5]"
                      />
                      <span className="text-gray-700">Full Payment (10% discount)</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#D88717] hover:bg-[#D88717]/80 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-200"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Enrollment'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Program Summary */}
            {selectedProgramData && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Selected Program</h3>
                <div className="space-y-3">
                  <h4 className="font-semibold text-[#0D13CC]">{selectedProgramData.title}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Price: <span className="font-semibold text-[#D88717]">{selectedProgramData.price}</span></div>
                    <div>Duration: <span className="font-semibold">{selectedProgramData.duration}</span></div>
                    <div>Level: <span className="font-semibold">{selectedProgramData.level}</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* Help & Support */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="mr-2">📞</span>
                  <span>Call: +1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📧</span>
                  <span>Email: info@cricketxpert.com</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">💬</span>
                  <span>Live Chat Available</span>
                </div>
              </div>
            </div>

            {/* Enrollment Benefits */}
            <div className="bg-gradient-to-r from-[#0D13CC] to-[#42ADF5] text-white rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Enrollment Benefits</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="text-[#D88717] mr-2">✓</span>
                  Professional Coaching
                </li>
                <li className="flex items-center">
                  <span className="text-[#D88717] mr-2">✓</span>
                  Modern Facilities
                </li>
                <li className="flex items-center">
                  <span className="text-[#D88717] mr-2">✓</span>
                  Equipment Provided
                </li>
                <li className="flex items-center">
                  <span className="text-[#D88717] mr-2">✓</span>
                  Progress Tracking
                </li>
                <li className="flex items-center">
                  <span className="text-[#D88717] mr-2">✓</span>
                  Certificate of Completion
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Enrollment;





