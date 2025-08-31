import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Calendar, 
  Upload, 
  Search, 
  Filter,
  X,
  Save,
  Eye,
  EyeOff,
  Clock,
  MapPin,
  Star,
  AlertCircle,
  CheckCircle,
  Loader2,
  FileText,
  Video,
  Link as LinkIcon,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { programsAPI, sessionsAPI, usersAPI, coachesAPI } from '../services/apiService';
import toast from 'react-hot-toast';

const ManagerDashboard = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  // Main data states
  const [programs, setPrograms] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI states
  const [activeTab, setActiveTab] = useState('programs');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCoachModal, setShowCoachModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [editingCoach, setEditingCoach] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  // Form states
  const [programForm, setProgramForm] = useState({
    title: '',
    description: '',
    coach: '',
    category: 'beginner',
    specialization: 'batting',
    duration: { weeks: 4, sessionsPerWeek: 2 },
    totalSessions: 8,
    price: 0,
    maxParticipants: 10,
    startDate: '',
    endDate: '',
    requirements: [],
    benefits: [],
    imageUrl: '',
    tags: []
  });

  const [materialForm, setMaterialForm] = useState({
    title: '',
    type: 'document',
    url: '',
    description: ''
  });

  const [rescheduleForm, setRescheduleForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
    reason: ''
  });

  const [coachForm, setCoachForm] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    specializations: [],
    experience: 0,
    certifications: [],
    bio: '',
    hourlyRate: 0,
    availability: [],
    profileImage: '',
    achievements: []
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Temporarily bypass authentication for testing
    fetchManagerData();
    // if (isAuthenticated && isAdmin() && user) {
    //   fetchManagerData();
    // }
  }, [isAuthenticated, user]);

  const fetchManagerData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all programs
      const programsResponse = await programsAPI.getAll();
      if (programsResponse.success) {
        setPrograms(programsResponse.data.docs || []);
      }

      // Fetch all coaches
      const coachesResponse = await coachesAPI.getAll();
      if (coachesResponse.success) {
        setCoaches(coachesResponse.data.docs || []);
      }

      // Fetch all sessions
      const sessionsResponse = await sessionsAPI.getAll();
      if (sessionsResponse.success) {
        setSessions(sessionsResponse.data.docs || []);
      }

    } catch (err) {
      console.error('Error fetching manager data:', err);
      setError(err.message);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Program CRUD operations
  const handleCreateProgram = () => {
    setEditingProgram(null);
    setProgramForm({
      title: '',
      description: '',
      coach: '',
      category: 'beginner',
      specialization: 'batting',
      duration: { weeks: 4, sessionsPerWeek: 2 },
      totalSessions: 8,
      price: 0,
      maxParticipants: 10,
      startDate: '',
      endDate: '',
      requirements: [],
      benefits: [],
      imageUrl: '',
      tags: []
    });
    setShowProgramModal(true);
  };

  const handleEditProgram = (program) => {
    setEditingProgram(program);
    setProgramForm({
      title: program.title || '',
      description: program.description || '',
      coach: program.coach?._id || '',
      category: program.category || 'beginner',
      specialization: program.specialization || 'batting',
      duration: program.duration || { weeks: 4, sessionsPerWeek: 2 },
      totalSessions: program.totalSessions || 8,
      price: program.price || 0,
      maxParticipants: program.maxParticipants || 10,
      startDate: program.startDate ? new Date(program.startDate).toISOString().split('T')[0] : '',
      endDate: program.endDate ? new Date(program.endDate).toISOString().split('T')[0] : '',
      requirements: program.requirements || [],
      benefits: program.benefits || [],
      imageUrl: program.imageUrl || '',
      tags: program.tags || []
    });
    setShowProgramModal(true);
  };

  const handleSaveProgram = async (e) => {
    e.preventDefault();
    
    if (!programForm.title.trim() || !programForm.description.trim() || !programForm.coach) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      
      const programData = {
        ...programForm,
        totalSessions: programForm.duration.weeks * programForm.duration.sessionsPerWeek
      };

      let response;
      if (editingProgram) {
        response = await programsAPI.update(editingProgram._id, programData);
      } else {
        response = await programsAPI.create(programData);
      }

      if (response.success) {
        toast.success(`Program ${editingProgram ? 'updated' : 'created'} successfully`);
        setShowProgramModal(false);
        fetchManagerData(); // Refresh data
      } else {
        throw new Error(response.message || 'Failed to save program');
      }
    } catch (err) {
      console.error('Error saving program:', err);
      toast.error(err.message || 'Failed to save program');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProgram = async (programId) => {
    if (!window.confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await programsAPI.delete(programId);
      if (response.success) {
        toast.success('Program deleted successfully');
        fetchManagerData(); // Refresh data
      } else {
        throw new Error(response.message || 'Failed to delete program');
      }
    } catch (err) {
      console.error('Error deleting program:', err);
      toast.error(err.message || 'Failed to delete program');
    }
  };

  // Material management
  const handleAddMaterial = (program) => {
    setEditingProgram(program);
    setMaterialForm({
      title: '',
      type: 'document',
      url: '',
      description: ''
    });
    setShowMaterialModal(true);
  };

  const handleSaveMaterial = async (e) => {
    e.preventDefault();
    
    if (!materialForm.title.trim() || !materialForm.url.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await programsAPI.addMaterial(editingProgram._id, materialForm);

      if (response.success) {
        toast.success('Material added successfully');
        setShowMaterialModal(false);
        fetchManagerData(); // Refresh data
      } else {
        throw new Error(response.message || 'Failed to add material');
      }
    } catch (err) {
      console.error('Error adding material:', err);
      toast.error(err.message || 'Failed to add material');
    } finally {
      setSubmitting(false);
    }
  };

  // Session reschedule
  const handleRescheduleSession = (session) => {
    setSelectedSession(session);
    setRescheduleForm({
      date: session.date ? new Date(session.date).toISOString().split('T')[0] : '',
      startTime: session.startTime || '',
      endTime: session.endTime || '',
      reason: ''
    });
    setShowRescheduleModal(true);
  };

  const handleSaveReschedule = async (e) => {
    e.preventDefault();
    
    if (!rescheduleForm.date || !rescheduleForm.startTime || !rescheduleForm.endTime || !rescheduleForm.reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await sessionsAPI.update(selectedSession._id, {
        date: rescheduleForm.date,
        startTime: rescheduleForm.startTime,
        endTime: rescheduleForm.endTime,
        rescheduleReason: rescheduleForm.reason
      });

      if (response.success) {
        toast.success('Session rescheduled successfully');
        setShowRescheduleModal(false);
        fetchManagerData(); // Refresh data
      } else {
        throw new Error(response.message || 'Failed to reschedule session');
      }
    } catch (err) {
      console.error('Error rescheduling session:', err);
      toast.error(err.message || 'Failed to reschedule session');
    } finally {
      setSubmitting(false);
    }
  };

  // Coach CRUD operations
  const handleCreateCoach = () => {
    setEditingCoach(null);
    setCoachForm({
      userId: '',
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
      specializations: [],
      experience: 0,
      certifications: [],
      bio: '',
      hourlyRate: 0,
      availability: [],
      profileImage: '',
      achievements: []
    });
    setShowCoachModal(true);
  };

  const handleEditCoach = (coach) => {
    setEditingCoach(coach);
    setCoachForm({
      userId: coach.userId?._id || '',
      firstName: coach.userId?.firstName || '',
      lastName: coach.userId?.lastName || '',
      email: coach.userId?.email || '',
      contactNumber: coach.userId?.contactNumber || '',
      specializations: coach.specializations || [],
      experience: coach.experience || 0,
      certifications: coach.certifications || [],
      bio: coach.bio || '',
      hourlyRate: coach.hourlyRate || 0,
      availability: coach.availability || [],
      profileImage: coach.profileImage || '',
      achievements: coach.achievements || []
    });
    setShowCoachModal(true);
  };

  const handleSaveCoach = async (e) => {
    e.preventDefault();
    
    if (!coachForm.firstName.trim() || !coachForm.lastName.trim() || !coachForm.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (coachForm.specializations.length === 0) {
      toast.error('Please select at least one specialization');
      return;
    }

    try {
      setSubmitting(true);
      
      let response;
      if (editingCoach) {
        // Update existing coach
        const updateData = {
          specializations: coachForm.specializations,
          experience: coachForm.experience,
          certifications: coachForm.certifications,
          bio: coachForm.bio,
          hourlyRate: coachForm.hourlyRate,
          availability: coachForm.availability,
          profileImage: coachForm.profileImage,
          achievements: coachForm.achievements
        };
        response = await coachesAPI.update(editingCoach._id, updateData);
      } else {
        // Create new coach - first create user, then coach profile
        const username = `${coachForm.firstName.toLowerCase()}.${coachForm.lastName.toLowerCase()}`.replace(/\s+/g, '');
        const userData = {
          username: username,
          firstName: coachForm.firstName,
          lastName: coachForm.lastName,
          email: coachForm.email,
          contactNumber: coachForm.contactNumber,
          role: 'coach',
          password: 'TempPass123!' // Temporary password - should be changed on first login
        };
        
        const userResponse = await usersAPI.create(userData);
        if (!userResponse.success) {
          throw new Error(userResponse.message || 'Failed to create user');
        }

        const coachData = {
          userId: userResponse.data._id,
          specializations: coachForm.specializations,
          experience: coachForm.experience,
          certifications: coachForm.certifications,
          bio: coachForm.bio,
          hourlyRate: coachForm.hourlyRate,
          availability: coachForm.availability,
          profileImage: coachForm.profileImage,
          achievements: coachForm.achievements
        };
        
        response = await coachesAPI.create(coachData);
      }

      if (response.success) {
        toast.success(`Coach ${editingCoach ? 'updated' : 'created'} successfully`);
        setShowCoachModal(false);
        fetchManagerData(); // Refresh data
      } else {
        throw new Error(response.message || 'Failed to save coach');
      }
    } catch (err) {
      console.error('Error saving coach:', err);
      toast.error(err.message || 'Failed to save coach');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCoach = async (coachId) => {
    if (!window.confirm('Are you sure you want to deactivate this coach? This action will set their status to inactive.')) {
      return;
    }

    try {
      const response = await coachesAPI.delete(coachId);
      if (response.success) {
        toast.success('Coach deactivated successfully');
        fetchManagerData(); // Refresh data
      } else {
        throw new Error(response.message || 'Failed to deactivate coach');
      }
    } catch (err) {
      console.error('Error deactivating coach:', err);
      toast.error(err.message || 'Failed to deactivate coach');
    }
  };

  const handleToggleCoachStatus = async (coachId, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'activate' : 'deactivate';
    
    if (!window.confirm(`Are you sure you want to ${action} this coach?`)) {
      return;
    }

    try {
      const response = await coachesAPI.toggleStatus(coachId, { isActive: newStatus });
      if (response.success) {
        toast.success(`Coach ${action}d successfully`);
        fetchManagerData(); // Refresh data
      } else {
        throw new Error(response.message || `Failed to ${action} coach`);
      }
    } catch (err) {
      console.error(`Error ${action}ing coach:`, err);
      toast.error(err.message || `Failed to ${action} coach`);
    }
  };

  const addSpecialization = (specialization) => {
    if (!coachForm.specializations.includes(specialization)) {
      setCoachForm(prev => ({
        ...prev,
        specializations: [...prev.specializations, specialization]
      }));
    }
  };

  const removeSpecialization = (specialization) => {
    setCoachForm(prev => ({
      ...prev,
      specializations: prev.specializations.filter(spec => spec !== specialization)
    }));
  };

  const addAchievement = () => {
    setCoachForm(prev => ({
      ...prev,
      achievements: [...prev.achievements, '']
    }));
  };

  const updateAchievement = (index, value) => {
    setCoachForm(prev => ({
      ...prev,
      achievements: prev.achievements.map((achievement, i) => 
        i === index ? value : achievement
      )
    }));
  };

  const removeAchievement = (index) => {
    setCoachForm(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  // Filter and search functions
  const filteredPrograms = programs.filter(program => {
    const coachName = program.coach?.userId ? 
      `${program.coach.userId.firstName} ${program.coach.userId.lastName}` : '';
    
    const matchesSearch = program.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coachName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || program.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const filteredCoaches = coaches.filter(coach => 
    coach.userId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coach.specializations?.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ||
    coach.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSessions = sessions.filter(session =>
    session.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.program?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.coach?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getMaterialIcon = (type) => {
    switch (type) {
      case 'video': return Video;
      case 'document': return FileText;
      case 'link': return LinkIcon;
      default: return FileText;
    }
  };

  // Temporarily bypass authentication for testing
  // if (!isAuthenticated) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center max-w-md">
  //         <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
  //         <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
  //         <p className="text-gray-600 mb-6">You need to be logged in to access the manager dashboard.</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!isAdmin()) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center max-w-md">
  //         <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
  //         <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
  //         <p className="text-gray-600 mb-6">Only authenticated managers can access this dashboard.</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="mt-2 text-lg text-gray-600">
                Manage coaching programs, coaches, and sessions
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Programs</p>
                  <p className="text-2xl font-bold text-blue-600">{programs.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Active Coaches</p>
                  <p className="text-2xl font-bold text-green-600">{coaches.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-purple-600">{sessions.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'programs', name: 'Programs', icon: Users },
              { id: 'coaches', name: 'Coaches', icon: Star },
              { id: 'sessions', name: 'Sessions', icon: Calendar }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent size={20} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {activeTab === 'programs' && (
            <div className="flex items-center space-x-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="professional">Professional</option>
              </select>
              
              <button
                onClick={handleCreateProgram}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                <span>New Program</span>
              </button>
            </div>
          )}

          {activeTab === 'coaches' && (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCreateCoach}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus size={20} />
                <span>New Coach</span>
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h4>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchManagerData}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Programs Tab */}
            {activeTab === 'programs' && (
              <div className="space-y-6">
                {filteredPrograms.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Programs Found</h4>
                    <p className="text-gray-600 mb-6">
                      {searchTerm || filterCategory !== 'all' 
                        ? 'No programs match your search criteria.' 
                        : 'No programs have been created yet.'}
                    </p>
                    {!searchTerm && filterCategory === 'all' && (
                      <button
                        onClick={handleCreateProgram}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create First Program
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {filteredPrograms.map((program) => (
                      <div key={program._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {program.title}
                            </h3>
                            <p className="text-gray-600 mb-3 line-clamp-2">
                              {program.description}
                            </p>
                            
                            {/* Program Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                              <div>
                                <span className="font-medium">Coach:</span>
                                <p>{program.coach?.userId ? `${program.coach.userId.firstName} ${program.coach.userId.lastName}` : 'Unassigned'}</p>
                              </div>
                              <div>
                                <span className="font-medium">Category:</span>
                                <p className="capitalize">{program.category}</p>
                              </div>
                              <div>
                                <span className="font-medium">Duration:</span>
                                <p>{program.duration?.weeks} weeks</p>
                              </div>
                              <div>
                                <span className="font-medium">Price:</span>
                                <p>{formatPrice(program.price)}</p>
                              </div>
                            </div>

                            {/* Materials */}
                            {program.materials && program.materials.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-medium text-gray-900 mb-2">Materials ({program.materials.length})</h4>
                                <div className="flex flex-wrap gap-2">
                                  {program.materials.slice(0, 3).map((material, index) => {
                                    const IconComponent = getMaterialIcon(material.type);
                                    return (
                                      <div key={index} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-xs">
                                        <IconComponent size={12} />
                                        <span>{material.title}</span>
                                      </div>
                                    );
                                  })}
                                  {program.materials.length > 3 && (
                                    <div className="bg-gray-100 px-2 py-1 rounded text-xs">
                                      +{program.materials.length - 3} more
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="ml-4 flex flex-col space-y-2">
                            <button
                              onClick={() => handleEditProgram(program)}
                              className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors"
                            >
                              <Edit size={16} />
                              <span>Edit</span>
                            </button>
                            
                            <button
                              onClick={() => handleAddMaterial(program)}
                              className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-2 rounded-md hover:bg-green-100 transition-colors"
                            >
                              <Upload size={16} />
                              <span>Materials</span>
                            </button>
                            
                            <button
                              onClick={() => handleDeleteProgram(program._id)}
                              className="flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-2 rounded-md hover:bg-red-100 transition-colors"
                            >
                              <Trash2 size={16} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Coaches Tab */}
            {activeTab === 'coaches' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Coach
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Specializations
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Experience
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Programs
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCoaches.map((coach) => (
                        <tr key={coach._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="text-blue-600" size={20} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {coach.userId?.firstName} {coach.userId?.lastName}
                                </div>
                                <div className="text-sm text-gray-500">{coach.userId?.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {coach.specializations?.slice(0, 2).map((spec, index) => (
                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                  {spec}
                                </span>
                              ))}
                              {coach.specializations?.length > 2 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  +{coach.specializations.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {coach.experience || 0} years
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Star className="text-yellow-400 fill-current" size={16} />
                              <span className="ml-1 text-sm text-gray-900">
                                {coach.rating || 0}/5
                              </span>
                              <span className="ml-1 text-xs text-gray-500">
                                ({coach.totalReviews || 0})
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {programs.filter(p => p.coach?._id === coach._id).length}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              coach.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {coach.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditCoach(coach)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                title="Edit Coach"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleToggleCoachStatus(coach._id, coach.isActive)}
                                className={`p-1 rounded ${
                                  coach.isActive 
                                    ? 'text-red-600 hover:text-red-900 hover:bg-red-50' 
                                    : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                                }`}
                                title={coach.isActive ? 'Deactivate Coach' : 'Activate Coach'}
                              >
                                {coach.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                              <button
                                onClick={() => handleDeleteCoach(coach._id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                title="Delete Coach"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {filteredCoaches.length === 0 && (
                  <div className="text-center py-12">
                    <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Coaches Found</h4>
                    <p className="text-gray-600">
                      {searchTerm ? 'No coaches match your search criteria.' : 'No coaches are registered yet.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Sessions Tab */}
            {activeTab === 'sessions' && (
              <div className="space-y-6">
                {filteredSessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Sessions Found</h4>
                    <p className="text-gray-600">
                      {searchTerm ? 'No sessions match your search criteria.' : 'No sessions have been scheduled yet.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredSessions.map((session) => {
                      const { date, time } = formatDateTime(session.date);
                      return (
                        <div key={session._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {session.title}
                              </h3>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                                <div className="flex items-center space-x-2">
                                  <Calendar size={16} />
                                  <span>{date}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock size={16} />
                                  <span>{time}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Users size={16} />
                                  <span>{session.participants?.length || 0}/{session.maxParticipants || 'N/A'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPin size={16} />
                                  <span>{session.ground?.name || 'TBD'}</span>
                                </div>
                              </div>

                              <div className="text-sm text-gray-600">
                                <p><span className="font-medium">Program:</span> {session.program?.title}</p>
                                <p><span className="font-medium">Coach:</span> {session.coach?.name}</p>
                              </div>
                            </div>

                            <div className="ml-4">
                              <button
                                onClick={() => handleRescheduleSession(session)}
                                className="flex items-center space-x-2 bg-orange-50 text-orange-700 px-3 py-2 rounded-md hover:bg-orange-100 transition-colors"
                              >
                                <Clock size={16} />
                                <span>Reschedule</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Program Modal */}
      {showProgramModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingProgram ? 'Edit Program' : 'Create New Program'}
                </h3>
                <button
                  onClick={() => setShowProgramModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveProgram} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={programForm.title}
                      onChange={(e) => setProgramForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coach *
                    </label>
                    <select
                      value={programForm.coach}
                      onChange={(e) => setProgramForm(prev => ({ ...prev, coach: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Coach</option>
                      {coaches.map(coach => (
                        <option key={coach._id} value={coach._id}>
                          {coach.userId?.firstName} {coach.userId?.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={programForm.description}
                    onChange={(e) => setProgramForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={programForm.category}
                      onChange={(e) => setProgramForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="professional">Professional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization
                    </label>
                    <select
                      value={programForm.specialization}
                      onChange={(e) => setProgramForm(prev => ({ ...prev, specialization: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="batting">Batting</option>
                      <option value="bowling">Bowling</option>
                      <option value="fielding">Fielding</option>
                      <option value="wicket-keeping">Wicket Keeping</option>
                      <option value="all-rounder">All Rounder</option>
                      <option value="fitness">Fitness</option>
                      <option value="mental-coaching">Mental Coaching</option>
                    </select>
                  </div>
                </div>

                {/* Duration and Sessions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (Weeks)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={programForm.duration.weeks}
                      onChange={(e) => setProgramForm(prev => ({ 
                        ...prev, 
                        duration: { ...prev.duration, weeks: parseInt(e.target.value) || 1 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sessions/Week
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={programForm.duration.sessionsPerWeek}
                      onChange={(e) => setProgramForm(prev => ({ 
                        ...prev, 
                        duration: { ...prev.duration, sessionsPerWeek: parseInt(e.target.value) || 1 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Sessions
                    </label>
                    <input
                      type="number"
                      value={programForm.duration.weeks * programForm.duration.sessionsPerWeek}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>

                {/* Price and Participants */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (LKR)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={programForm.price}
                      onChange={(e) => setProgramForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={programForm.maxParticipants}
                      onChange={(e) => setProgramForm(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={programForm.startDate}
                      onChange={(e) => setProgramForm(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={programForm.endDate}
                      onChange={(e) => setProgramForm(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowProgramModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Save size={16} />
                    )}
                    <span>{submitting ? 'Saving...' : 'Save Program'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Material Modal */}
      {showMaterialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Material</h3>
              <button
                onClick={() => setShowMaterialModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Program: <span className="font-medium">{editingProgram?.title}</span>
              </p>
            </div>

            <form onSubmit={handleSaveMaterial} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={materialForm.type}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="document">Document (PDF)</option>
                  <option value="video">Video</option>
                  <option value="link">Link</option>
                  <option value="image">Image</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL *
                </label>
                <input
                  type="url"
                  value={materialForm.url}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMaterialModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Upload size={16} />
                  )}
                  <span>{submitting ? 'Adding...' : 'Add Material'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Reschedule Session</h3>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Session: <span className="font-medium">{selectedSession?.title}</span>
              </p>
              <p className="text-sm text-gray-600">
                Program: <span className="font-medium">{selectedSession?.program?.title}</span>
              </p>
            </div>

            <form onSubmit={handleSaveReschedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Date *
                </label>
                <input
                  type="date"
                  value={rescheduleForm.date}
                  onChange={(e) => setRescheduleForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={rescheduleForm.startTime}
                    onChange={(e) => setRescheduleForm(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="time"
                    value={rescheduleForm.endTime}
                    onChange={(e) => setRescheduleForm(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Reschedule *
                </label>
                <textarea
                  value={rescheduleForm.reason}
                  onChange={(e) => setRescheduleForm(prev => ({ ...prev, reason: e.target.value }))}
                  rows={3}
                  placeholder="Explain why this session needs to be rescheduled..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Clock size={16} />
                  )}
                  <span>{submitting ? 'Rescheduling...' : 'Reschedule Session'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coach Modal */}
      {showCoachModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCoach ? 'Edit Coach' : 'Add New Coach'}
                </h3>
                <button
                  onClick={() => setShowCoachModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveCoach} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={coachForm.firstName}
                      onChange={(e) => setCoachForm(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={editingCoach}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={coachForm.lastName}
                      onChange={(e) => setCoachForm(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={editingCoach}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={coachForm.email}
                      onChange={(e) => setCoachForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      disabled={editingCoach}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      value={coachForm.contactNumber}
                      onChange={(e) => setCoachForm(prev => ({ ...prev, contactNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={editingCoach}
                    />
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specializations *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                    {['batting', 'bowling', 'fielding', 'wicket-keeping', 'all-rounder', 'fitness', 'mental-coaching'].map((spec) => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => 
                          coachForm.specializations.includes(spec) 
                            ? removeSpecialization(spec) 
                            : addSpecialization(spec)
                        }
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                          coachForm.specializations.includes(spec)
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {spec.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                  {coachForm.specializations.length === 0 && (
                    <p className="text-sm text-red-600">Please select at least one specialization</p>
                  )}
                </div>

                {/* Experience and Rate */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience (Years) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={coachForm.experience}
                      onChange={(e) => setCoachForm(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hourly Rate (LKR) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={coachForm.hourlyRate}
                      onChange={(e) => setCoachForm(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={coachForm.bio}
                    onChange={(e) => setCoachForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    maxLength={1000}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us about the coach's background, achievements, and coaching philosophy..."
                  />
                  <p className="text-xs text-gray-500 mt-1">{coachForm.bio.length}/1000 characters</p>
                </div>

                {/* Achievements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Achievements
                  </label>
                  <div className="space-y-2">
                    {coachForm.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={achievement}
                          onChange={(e) => updateAchievement(index, e.target.value)}
                          placeholder="Enter achievement..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => removeAchievement(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addAchievement}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Plus size={16} />
                      <span>Add Achievement</span>
                    </button>
                  </div>
                </div>

                {/* Profile Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    value={coachForm.profileImage}
                    onChange={(e) => setCoachForm(prev => ({ ...prev, profileImage: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCoachModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Save size={16} />
                    )}
                    <span>{submitting ? 'Saving...' : (editingCoach ? 'Update Coach' : 'Create Coach')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;





