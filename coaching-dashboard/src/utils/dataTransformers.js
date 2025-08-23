// Transform backend coach data to frontend format
export const transformCoachData = (backendCoach) => {
  // Get user data from populated UserId
  const userData = backendCoach.UserId || {};
  
  // Transform availability to schedule format
  const schedule = (backendCoach.availability || []).map((slot, index) => ({
    id: index + 1,
    day: slot.day,
    time: `${slot.startTime} - ${slot.endTime}`,
    session: `${backendCoach.specialization?.join(', ') || 'Training'} Session`,
    players: 0, // This will be calculated from sessions
    location: 'Main Ground', // Default location
    type: 'Regular Session'
  }));

  // Calculate assigned players from session metrics
  const assignedPlayers = backendCoach.sessionMetrics?.totalSessions || 0;

  return {
    id: backendCoach._id,
    name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username || 'Unknown',
    email: userData.email || '',
    phone: userData.contactNumber || '',
    specialization: backendCoach.specialization?.join(', ') || 'General',
    experience: `${backendCoach.experienceYears || 0} years`,
    status: backendCoach.status === 'active' ? 'Active' : 'Inactive',
    assignedPlayers,
    image: userData.profileImageURL || `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 99)}.jpg`,
    schedule,
    // Backend data for reference
    backendData: backendCoach
  };
};

// Transform frontend coach data to backend format
export const transformToBackendFormat = (frontendCoach) => {
  // Parse experience years
  const experienceYears = parseInt(frontendCoach.experience.match(/\d+/)?.[0] || '0');
  
  // Transform schedule back to availability format
  const availability = frontendCoach.schedule.map(slot => {
    const [startTime, endTime] = slot.time.split(' - ');
    return {
      day: slot.day,
      startTime,
      endTime,
      isActive: true
    };
  });

  return {
    UserId: frontendCoach.userId, // This should be set when creating
    specialization: frontendCoach.specialization.split(', '),
    experienceYears,
    hourlyRate: frontendCoach.hourlyRate || 50, // Default hourly rate
    availability,
    status: frontendCoach.status.toLowerCase(),
    bio: frontendCoach.bio || ''
  };
};

// Transform session data to frontend format
export const transformSessionData = (backendSession) => {
  return {
    id: backendSession._id,
    day: new Date(backendSession.date).toLocaleDateString('en-US', { weekday: 'long' }),
    time: `${backendSession.startTime} - ${backendSession.endTime}`,
    session: `Training Session`,
    players: 1, // Individual session
    location: backendSession.ground?.name || 'Main Ground',
    type: 'Scheduled Session',
    date: backendSession.date,
    status: backendSession.status
  };
};

// Transform user data to frontend format
export const transformUserData = (backendUser) => {
  return {
    id: backendUser._id,
    name: `${backendUser.firstName || ''} ${backendUser.lastName || ''}`.trim() || backendUser.username,
    email: backendUser.email,
    phone: backendUser.contactNumber,
    role: backendUser.role,
    status: backendUser.status === 'active' ? 'Active' : 'Inactive',
    image: backendUser.profileImageURL || `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 99)}.jpg`
  };
};

// Helper function to merge coach and user data
export const mergeCoachAndUserData = (coach, user) => {
  if (!coach || !user) return null;
  
  return {
    id: coach._id,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
    email: user.email,
    phone: user.contactNumber,
    specialization: coach.specialization?.join(', ') || 'General',
    experience: `${coach.experienceYears || 0} years`,
    status: coach.status === 'active' ? 'Active' : 'Inactive',
    assignedPlayers: coach.sessionMetrics?.totalSessions || 0,
    image: user.profileImageURL || `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 99)}.jpg`,
    schedule: (coach.availability || []).map((slot, index) => ({
      id: index + 1,
      day: slot.day,
      time: `${slot.startTime} - ${slot.endTime}`,
      session: `${coach.specialization?.join(', ') || 'Training'} Session`,
      players: 0,
      location: 'Main Ground',
      type: 'Regular Session'
    })),
    backendData: { coach, user }
  };
};
