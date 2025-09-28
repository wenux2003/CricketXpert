import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

export default function GroundManagerLayout() {
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (storedUserInfo) {
            setUserInfo(storedUserInfo);
        }
    }, []);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('userInfo');
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-6">
                            <h1 className="text-xl font-semibold text-gray-900">Ground Management</h1>
                            <nav className="flex space-x-4">
                                <button 
                                    onClick={() => navigate('/ground-manager/grounds')}
                                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                >
                                    Grounds
                                </button>
                                <button 
                                    onClick={() => navigate('/ground-manager/bookings')}
                                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                >
                                    Bookings
                                </button>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <img
                                    src={userInfo?.profileImageURL ? `http://localhost:5000${userInfo.profileImageURL}` : `https://placehold.co/32x32/072679/FFFFFF?text=${userInfo?.username?.charAt(0) || 'G'}`}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => {
                                        console.log('Profile clicked, going to ground manager dashboard');
                                        navigate('/ground-manager');
                                    }}
                                    title="Go to Ground Manager Dashboard"
                                />
                                <span className="text-sm font-medium text-gray-700">{userInfo?.username}</span>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
}
