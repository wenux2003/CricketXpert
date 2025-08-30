# Cricket Coaching Management System

A comprehensive MERN stack application for managing cricket coaching programs, sessions, enrollments, and payments.

## 🏗️ System Architecture

### Core Features
- **Coach Management**: CRUD operations for coaches with specializations and availability
- **Coaching Programs**: Create and manage coaching programs with materials and curriculum
- **Enrollment System**: User enrollment with payment integration
- **Session Booking**: Ground slot management with calendar integration
- **Progress Tracking**: Student progress monitoring and certificate generation
- **Notification System**: Real-time notifications for all stakeholders
- **Payment Processing**: Integrated payment system with receipts and refunds
- **Certificate Generation**: Automated PDF certificate generation and verification

## 📊 Database Models

### Core Models
1. **User** - Base user model with roles (customer, coach, coaching_manager, admin)
2. **Coach** - Coach profiles with specializations and availability
3. **CoachingProgram** - Coaching programs with curriculum and materials
4. **Enrollment** - User enrollments with progress tracking
5. **Session** - Individual coaching sessions with ground slot management
6. **Payment** - Payment records with support for refunds and installments
7. **Notification** - Notification system with multiple delivery channels
8. **Certificate** - Digital certificates with verification
9. **Ground** - Ground information with slot management

## 🛠️ API Endpoints

### Coach Management (`/api/coaches`)
```
GET    /                     - Get all coaches (with filters)
GET    /:id                  - Get coach by ID
POST   /                     - Create new coach
PUT    /:id                  - Update coach
DELETE /:id                  - Delete coach (soft delete)
GET    /:id/stats            - Get coach statistics
PUT    /:id/availability     - Update coach availability
GET    /:id/programs         - Get coach's programs
```

### Coaching Programs (`/api/coaching-programs`)
```
GET    /                     - Get all programs (with filters)
GET    /:id                  - Get program by ID
POST   /                     - Create new program
PUT    /:id                  - Update program
DELETE /:id                  - Delete program (soft delete)
POST   /:id/materials        - Add material to program
DELETE /:programId/materials/:materialId - Remove material
GET    /:id/enrollments      - Get program enrollments
GET    /:id/stats            - Get program statistics
```

### Enrollments (`/api/enrollments`)
```
POST   /                     - Create new enrollment
POST   /confirm-payment      - Confirm enrollment payment
GET    /user/:userId         - Get user enrollments
GET    /:id                  - Get enrollment by ID
PUT    /:enrollmentId/progress - Update enrollment progress
POST   /:enrollmentId/feedback - Add coach feedback
PUT    /:enrollmentId/cancel - Cancel enrollment
POST   /:enrollmentId/certificate - Generate certificate
```

### Sessions (`/api/sessions`)
```
GET    /                     - Get all sessions (with filters)
GET    /:id                  - Get session by ID
POST   /                     - Create new session
POST   /:sessionId/book      - Book session for user
POST   /:sessionId/cancel-booking - Cancel session booking
PUT    /:id                  - Update session
POST   /:sessionId/attendance - Mark attendance
GET    /available-slots      - Get available ground slots
GET    /calendar             - Get session calendar data
```

### Payments (`/api/payments`)
```
POST   /                     - Create payment record
POST   /webhook/completion   - Process payment completion (webhook)
GET    /:id                  - Get payment by ID
GET    /user/:userId         - Get user payments
POST   /:paymentId/refund    - Process refund
GET    /stats                - Get payment statistics
GET    /:paymentId/receipt   - Generate payment receipt
```

### Notifications (`/api/notifications`)
```
GET    /user/:userId         - Get user notifications
GET    /:id                  - Get notification by ID
POST   /                     - Create notification
PUT    /:notificationId/read - Mark as read
PUT    /user/:userId/mark-all-read - Mark all as read
DELETE /:notificationId      - Delete notification
GET    /user/:userId/unread-count - Get unread count
GET    /user/:userId/preferences - Get notification preferences
PUT    /user/:userId/preferences - Update notification preferences
POST   /bulk                 - Send bulk notifications
GET    /stats                - Get notification statistics
```

### Certificates (`/api/certificates`)
```
POST   /generate/:enrollmentId - Generate certificate
GET    /:id                  - Get certificate by ID
GET    /user/:userId         - Get user certificates
GET    /:certificateId/download - Download certificate PDF
GET    /verify/:certificateNumber - Verify certificate (public)
PUT    /:certificateId/revoke - Revoke certificate
GET    /stats                - Get certificate statistics
```

### Calendar Integration (`/api/calendar`)
```
GET    /user/:userId/ical    - Generate user iCal calendar
GET    /coach/:coachId/ical  - Generate coach iCal calendar
GET    /session/:sessionId/google - Get Google Calendar URL
GET    /session/:sessionId/outlook - Get Outlook Calendar URL
GET    /conflicts            - Check session conflicts
POST   /session/:sessionId/booking-event - Generate booking event
GET    /session/:sessionId/all-links - Get all calendar links
```

### Dashboard (`/api/dashboard`)
```
GET    /user/:userId         - Get user dashboard data
GET    /coach/:coachId       - Get coach dashboard data
GET    /admin                - Get admin dashboard data
```

## 🎯 User Workflows

### Customer Journey
1. **Browse Programs**: View available coaching programs with filters
2. **Enroll**: Select program and complete payment
3. **Book Sessions**: Choose specific session dates/times based on availability
4. **Attend Sessions**: Receive reminders and calendar integration
5. **Track Progress**: View progress dashboard and coach feedback
6. **Complete Program**: Download certificate upon completion

### Coach Workflow
1. **Manage Profile**: Update specializations, availability, and bio
2. **View Assigned Programs**: See programs and enrolled students
3. **Conduct Sessions**: Mark attendance and provide feedback
4. **Track Students**: Monitor progress and provide guidance
5. **Manage Schedule**: View calendar and session conflicts

### Coach Manager Workflow
1. **Manage Coaches**: CRUD operations for coach profiles
2. **Create Programs**: Design curriculum and set pricing
3. **Add Materials**: Upload resources and course content
4. **Monitor Performance**: View statistics and analytics
5. **Handle Enrollments**: Manage enrollment approvals

## 🔄 Notification System

### Notification Types
- `enrollment_confirmation` - Enrollment confirmed
- `enrollment_pending` - Enrollment awaiting payment
- `session_scheduled` - New session scheduled
- `session_reminder` - Session reminder (1 hour before)
- `session_cancelled` - Session cancelled
- `payment_received` - Payment successful
- `payment_failed` - Payment failed
- `program_completed` - Program completion
- `certificate_ready` - Certificate available
- `coach_feedback` - New coach feedback

### Delivery Channels
- **In-App**: Real-time dashboard notifications
- **Email**: Email notifications for important events
- **SMS**: Critical reminders (optional integration)

## 💳 Payment Integration

### Supported Features
- Multiple payment methods (credit card, bank transfer, mobile payment)
- Payment provider integration (PayHere, Stripe, etc.)
- Automatic receipt generation
- Refund processing
- Installment support
- Tax and discount calculations

### Payment Flow
1. User selects program and initiates enrollment
2. Payment record created with pending status
3. User redirected to payment provider
4. Webhook processes payment completion
5. Enrollment activated on successful payment
6. Receipt generated and notifications sent

## 📅 Calendar Integration

### Features
- **iCal Export**: Generate .ics files for calendar import
- **Google Calendar**: Direct integration with Google Calendar
- **Outlook Integration**: Direct integration with Outlook
- **Conflict Detection**: Automatic session conflict checking
- **Booking Events**: Calendar events for confirmed bookings

### Ground Slot Management
- Multiple slots per ground (1-12 slots supported)
- Time-based availability checking
- Maximum sessions per day per slot
- Real-time conflict detection

## 📜 Certificate System

### Features
- **Automatic Generation**: PDF certificates generated upon completion
- **Digital Verification**: Public verification via certificate number
- **Custom Templates**: Configurable certificate designs
- **Blockchain-ready**: Verification hash for future blockchain integration
- **Download Tracking**: Monitor certificate downloads

### Eligibility Criteria
- Minimum 80% session attendance
- Program completion status
- All assessments completed
- Payment fully processed

## 🔐 Security Features

### Data Protection
- Encrypted payment information
- Secure file uploads
- Input validation and sanitization
- Role-based access control

### Authentication & Authorization
- JWT token-based authentication (to be implemented)
- Role-based permissions
- Session management
- Password hashing (bcrypt recommended)

## 📈 Analytics & Reporting

### Available Statistics
- **Coach Performance**: Session counts, student ratings, revenue
- **Program Analytics**: Enrollment trends, completion rates
- **Payment Reports**: Revenue tracking, refund analysis
- **User Engagement**: Progress tracking, attendance rates
- **Certificate Analytics**: Issuance trends, verification stats

## 🚀 Getting Started

### Prerequisites
```bash
Node.js >= 14.x
MongoDB >= 4.x
```

### Installation
```bash
# Install dependencies
npm install

# Additional dependencies for PDF and calendar
npm install pdfkit ical-generator

# Set up environment variables
cp .env.example .env
# Edit .env with your database and service configurations

# Start development server
npm run dev
```

### Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cricketxpert
JWT_SECRET=your_jwt_secret
PAYHERE_MERCHANT_ID=your_payhere_merchant_id
PAYHERE_SECRET=your_payhere_secret
EMAIL_SERVICE_API_KEY=your_email_service_key
BASE_URL=http://localhost:3000
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Coach registration and profile management
- [ ] Program creation with materials
- [ ] Enrollment process with payment
- [ ] Session booking with ground slot validation
- [ ] Progress tracking and feedback
- [ ] Certificate generation and verification
- [ ] Notification delivery across channels
- [ ] Calendar integration and export

### API Testing
Use tools like Postman or Insomnia to test API endpoints. Import the provided collection for comprehensive testing.

## 🔄 Future Enhancements

### Planned Features
- **Video Conferencing**: Integrate Zoom/Teams for virtual sessions
- **Mobile App**: React Native app for iOS/Android
- **Live Streaming**: Stream sessions for remote participants
- **AI Analytics**: Performance analysis using machine learning
- **Blockchain Certificates**: Immutable certificate verification
- **Multi-language Support**: Internationalization
- **Advanced Reporting**: Business intelligence dashboard

### Scalability Considerations
- Redis for session management and caching
- CDN for file uploads and static assets
- Database sharding for large datasets
- Microservices architecture for enterprise scale
- Load balancing for high availability

## 📞 Support & Maintenance

### Monitoring
- Application performance monitoring
- Error tracking and logging
- Database performance optimization
- User activity analytics

### Backup Strategy
- Daily database backups
- File upload backups to cloud storage
- Configuration backups
- Disaster recovery procedures

---

This comprehensive coaching management system provides a solid foundation for cricket coaching businesses with room for expansion and customization based on specific requirements.
