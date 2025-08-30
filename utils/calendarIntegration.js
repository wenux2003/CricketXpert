const Session = require('../models/Session');

// Try to import ical-generator, but make it optional
let ical;
try {
  ical = require('ical-generator');
} catch (error) {
  console.warn('ical-generator not installed. Calendar generation will be disabled.');
  ical = null;
}

// Generate iCal calendar for user's sessions
const generateUserCalendar = async (userId, options = {}) => {
  if (!ical) {
    throw new Error('ical-generator not available');
  }
  
  try {
    const { startDate, endDate, programId } = options;
    
    // Build filter
    const filter = {
      'participants.user': userId,
      status: { $in: ['scheduled', 'in-progress'] }
    };

    if (startDate && endDate) {
      filter.scheduledDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (programId) {
      filter.program = programId;
    }

    // Fetch sessions
    const sessions = await Session.find(filter)
      .populate('program', 'title description')
      .populate('ground', 'description')
      .populate({
        path: 'coach',
        populate: {
          path: 'userId',
          select: 'firstName lastName email'
        }
      })
      .sort({ scheduledDate: 1 });

    // Create calendar
    const calendar = ical({
      domain: 'cricketxpert.com',
      name: 'My Cricket Coaching Sessions',
      description: 'Your scheduled cricket coaching sessions'
    });

    // Add events
    sessions.forEach(session => {
      const startDateTime = new Date(session.scheduledDate);
      const [startHours, startMinutes] = session.startTime.split(':').map(Number);
      startDateTime.setHours(startHours, startMinutes, 0, 0);

      const endDateTime = new Date(session.scheduledDate);
      const [endHours, endMinutes] = session.endTime.split(':').map(Number);
      endDateTime.setHours(endHours, endMinutes, 0, 0);

      calendar.createEvent({
        start: startDateTime,
        end: endDateTime,
        summary: session.title,
        description: `
Program: ${session.program.title}
Coach: ${session.coach.userId.firstName} ${session.coach.userId.lastName}
Location: ${session.ground.description}
${session.description || ''}
        `.trim(),
        location: session.ground.description,
        uid: `session-${session._id}@cricketxpert.com`,
        organizer: {
          name: `${session.coach.userId.firstName} ${session.coach.userId.lastName}`,
          email: session.coach.userId.email || 'coach@cricketxpert.com'
        },
        categories: [
          { name: session.program.title }
        ],
        alarms: [
          {
            type: 'display',
            trigger: 600 // 10 minutes before
          },
          {
            type: 'display',
            trigger: 3600 // 1 hour before
          }
        ]
      });
    });

    return calendar.toString();
  } catch (error) {
    throw new Error(`Error generating calendar: ${error.message}`);
  }
};

// Generate iCal calendar for coach's sessions
const generateCoachCalendar = async (coachId, options = {}) => {
  if (!ical) {
    throw new Error('ical-generator not available');
  }
  
  try {
    const { startDate, endDate } = options;
    
    const filter = {
      coach: coachId,
      status: { $in: ['scheduled', 'in-progress'] }
    };

    if (startDate && endDate) {
      filter.scheduledDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const sessions = await Session.find(filter)
      .populate('program', 'title description')
      .populate('ground', 'description')
      .populate('participants.user', 'firstName lastName')
      .sort({ scheduledDate: 1 });

    const calendar = ical({
      domain: 'cricketxpert.com',
      name: 'My Coaching Sessions',
      description: 'Your scheduled coaching sessions'
    });

    sessions.forEach(session => {
      const startDateTime = new Date(session.scheduledDate);
      const [startHours, startMinutes] = session.startTime.split(':').map(Number);
      startDateTime.setHours(startHours, startMinutes, 0, 0);

      const endDateTime = new Date(session.scheduledDate);
      const [endHours, endMinutes] = session.endTime.split(':').map(Number);
      endDateTime.setHours(endHours, endMinutes, 0, 0);

      const participants = session.participants
        .map(p => `${p.user.firstName} ${p.user.lastName}`)
        .join(', ');

      calendar.createEvent({
        start: startDateTime,
        end: endDateTime,
        summary: `Coaching: ${session.title}`,
        description: `
Program: ${session.program.title}
Participants: ${participants}
Location: ${session.ground.description}
${session.description || ''}
        `.trim(),
        location: session.ground.description,
        uid: `coach-session-${session._id}@cricketxpert.com`,
        categories: [
          { name: 'Coaching' },
          { name: session.program.title }
        ],
        alarms: [
          {
            type: 'display',
            trigger: 900 // 15 minutes before
          }
        ]
      });
    });

    return calendar.toString();
  } catch (error) {
    throw new Error(`Error generating coach calendar: ${error.message}`);
  }
};

// Generate Google Calendar URL for a session
const generateGoogleCalendarUrl = (session) => {
  try {
    const startDateTime = new Date(session.scheduledDate);
    const [startHours, startMinutes] = session.startTime.split(':').map(Number);
    startDateTime.setHours(startHours, startMinutes, 0, 0);

    const endDateTime = new Date(session.scheduledDate);
    const [endHours, endMinutes] = session.endTime.split(':').map(Number);
    endDateTime.setHours(endHours, endMinutes, 0, 0);

    const startTime = startDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endTime = endDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: session.title,
      dates: `${startTime}/${endTime}`,
      details: `Program: ${session.program?.title || 'Cricket Coaching'}\nLocation: ${session.ground?.description || 'Cricket Ground'}`,
      location: session.ground?.description || 'Cricket Ground'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  } catch (error) {
    throw new Error(`Error generating Google Calendar URL: ${error.message}`);
  }
};

// Generate Outlook Calendar URL for a session
const generateOutlookCalendarUrl = (session) => {
  try {
    const startDateTime = new Date(session.scheduledDate);
    const [startHours, startMinutes] = session.startTime.split(':').map(Number);
    startDateTime.setHours(startHours, startMinutes, 0, 0);

    const endDateTime = new Date(session.scheduledDate);
    const [endHours, endMinutes] = session.endTime.split(':').map(Number);
    endDateTime.setHours(endHours, endMinutes, 0, 0);

    const params = new URLSearchParams({
      subject: session.title,
      startdt: startDateTime.toISOString(),
      enddt: endDateTime.toISOString(),
      body: `Program: ${session.program?.title || 'Cricket Coaching'}\nLocation: ${session.ground?.description || 'Cricket Ground'}`,
      location: session.ground?.description || 'Cricket Ground'
    });

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  } catch (error) {
    throw new Error(`Error generating Outlook Calendar URL: ${error.message}`);
  }
};

// Get session conflicts for a time slot
const getSessionConflicts = async (groundId, groundSlot, date, startTime, endTime, excludeSessionId = null) => {
  try {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const query = {
      ground: groundId,
      groundSlot: groundSlot,
      scheduledDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $nin: ['cancelled'] },
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    };

    if (excludeSessionId) {
      query._id = { $ne: excludeSessionId };
    }

    const conflicts = await Session.find(query)
      .populate('program', 'title')
      .populate({
        path: 'coach',
        populate: {
          path: 'userId',
          select: 'firstName lastName'
        }
      });

    return conflicts;
  } catch (error) {
    throw new Error(`Error checking session conflicts: ${error.message}`);
  }
};

// Generate calendar event for session booking confirmation
const generateSessionBookingEvent = (session, user) => {
  if (!ical) {
    throw new Error('ical-generator not available');
  }
  
  const startDateTime = new Date(session.scheduledDate);
  const [startHours, startMinutes] = session.startTime.split(':').map(Number);
  startDateTime.setHours(startHours, startMinutes, 0, 0);

  const endDateTime = new Date(session.scheduledDate);
  const [endHours, endMinutes] = session.endTime.split(':').map(Number);
  endDateTime.setHours(endHours, endMinutes, 0, 0);

  const calendar = ical({
    domain: 'cricketxpert.com',
    name: 'Session Booking Confirmation'
  });

  const event = calendar.createEvent({
    start: startDateTime,
    end: endDateTime,
    summary: session.title,
    description: `
You have successfully booked this cricket coaching session.

Program: ${session.program.title}
Coach: ${session.coach.userId.firstName} ${session.coach.userId.lastName}
Location: ${session.ground.description}

Please arrive 10 minutes early.
    `.trim(),
    location: session.ground.description,
    uid: `booking-${session._id}-${user._id}@cricketxpert.com`,
    organizer: {
      name: `${session.coach.userId.firstName} ${session.coach.userId.lastName}`,
      email: session.coach.userId.email || 'coach@cricketxpert.com'
    },
    attendees: [
      {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        status: 'accepted'
      }
    ],
    alarms: [
      {
        type: 'display',
        trigger: 600 // 10 minutes before
      }
    ]
  });

  return calendar.toString();
};

module.exports = {
  generateUserCalendar,
  generateCoachCalendar,
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
  getSessionConflicts,
  generateSessionBookingEvent
};
