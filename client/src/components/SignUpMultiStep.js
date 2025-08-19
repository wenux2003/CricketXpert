import React, { useState, useRef } from 'react';
import axios from 'axios';

// --- Icon Components (remain the same) ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const AddressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;

export default function SignUpMultiStep() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', dob: '', contactNumber: '', address: '',
        profileImageURL: '', email: '', username: '', password: '', confirmPassword: '',
    });
    // --- NEW STATE FOR FILE HANDLING ---
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const fileInputRef = useRef(null); // To trigger file input click

    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // --- INPUT VALIDATION HANDLERS (remain the same) ---
    const handleTextOnlyChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        setFormData({ ...formData, [e.target.name]: value });
    };
    const handleNumbersOnlyChange = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setFormData({ ...formData, [e.target.name]: value });
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- NEW IMAGE HANDLER ---
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create a preview URL
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // --- NAVIGATION AND SUBMISSION ---
    const nextStep = () => {
        if (formData.firstName && formData.lastName && formData.email) {
            setStep(2);
            setError('');
        } else {
            setError('Please fill in your First Name, Last Name, and Email.');
        }
    };
    const prevStep = () => setStep(1);

    const validatePassword = () => { /* ... (remains the same) ... */ 
        const { password, confirmPassword } = formData;
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return false;
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passwordRegex.test(password)) {
            setPasswordError("Password must be 8+ characters, with one uppercase letter, one number, and one symbol.");
            return false;
        }
        setPasswordError('');
        return true;
    };

    // --- UPDATED SUBMIT HANDLER ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePassword()) return;

        setLoading(true);
        setMessage('');
        setError('');

        let uploadedImagePath = '';

        // 1. Upload image if one is selected
        if (imageFile) {
            const uploadFormData = new FormData();
            uploadFormData.append('profileImage', imageFile); // 'profileImage' must match backend
            
            try {
                const uploadConfig = { headers: { 'Content-Type': 'multipart/form-data' } };
                const { data } = await axios.post('http://localhost:5000/api/upload', uploadFormData, uploadConfig);
                uploadedImagePath = data.filePath; // Get the URL from the backend
            } catch (uploadError) {
                setError('Image upload failed. Please try again.');
                setLoading(false);
                return;
            }
        }

        // 2. Register user with all data (including the new image URL)
        try {
            const registrationData = { ...formData, profileImageURL: uploadedImagePath };
            const { data } = await axios.post('http://localhost:5000/api/auth/register', registrationData);
            
            setMessage(data.message + " Redirecting to home page...");
            setTimeout(() => { window.location.href = '/'; }, 2000);
        } catch (regError) {
            setError(regError.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F1F2F7] flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 transition-all duration-500">
                <h2 className="text-3xl font-bold text-center text-[#072679] mb-2">Create Your Account</h2>
                <p className="text-center text-[#36516C] mb-6">Step {step} of 2</p>

                {step === 1 && (
                    <div className="space-y-4">
                        {/* --- NEW IMAGE UPLOAD UI --- */}
                        <div className="flex flex-col items-center space-y-2">
                            <div 
                                className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-200"
                                onClick={() => fileInputRef.current.click()} // Trigger hidden file input
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile Preview" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div className="text-center">
                                        <UploadIcon />
                                        <p className="text-xs text-gray-500">Upload Pic</p>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden" // Hide the default file input
                            />
                        </div>

                        {/* Other Step 1 inputs remain the same */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><UserIcon /></span><input type="text" name="firstName" placeholder="First Name*" value={formData.firstName} onChange={handleTextOnlyChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#42ADF5]" /></div>
                           <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><UserIcon /></span><input type="text" name="lastName" placeholder="Last Name*" value={formData.lastName} onChange={handleTextOnlyChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#42ADF5]" /></div>
                        </div>
                        <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><EmailIcon /></span><input type="email" name="email" placeholder="Email Address*" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#42ADF5]" /></div>
                        <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><CalendarIcon /></span><input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#42ADF5] text-gray-500" /></div>
                        <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><PhoneIcon /></span><input type="tel" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleNumbersOnlyChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#42ADF5]" /></div>
                        <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><AddressIcon /></span><input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#42ADF5]" /></div>
                        
                        <button onClick={nextStep} className="w-full bg-[#42ADF5] hover:bg-[#2C8ED1] text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors">Next</button>
                    </div>
                )}

                {step === 2 && ( /* Step 2 remains the same */
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><UserIcon /></span><input type="text" name="username" placeholder="Username*" value={formData.username} onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#42ADF5]" /></div>
                        <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><LockIcon /></span><input type="password" name="password" placeholder="Password*" value={formData.password} onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#42ADF5]" /></div>
                        <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><LockIcon /></span><input type="password" name="confirmPassword" placeholder="Confirm Password*" value={formData.confirmPassword} onChange={handleChange} required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#42ADF5]" /></div>
                        
                        {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
                        
                        <div className="flex items-center justify-between space-x-4">
                            <button type="button" onClick={prevStep} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg shadow-lg transition-colors">Back</button>
                            <button type="submit" disabled={loading} className="w-full bg-[#42ADF5] hover:bg-[#2C8ED1] text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors disabled:bg-gray-400">{loading ? 'Signing Up...' : 'Sign Up'}</button>
                        </div>
                    </form>
                )}

                {message && <p className="mt-4 text-center text-green-600 font-medium">{message}</p>}
                {error && <p className="mt-4 text-center text-red-600 font-medium">{error}</p>}
            </div>
        </div>
    );
}
