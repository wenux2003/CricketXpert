import React from "react";
import { useParams, Link } from "react-router-dom";

function ProgramDetails() {
  const { id } = useParams();
  
  // Sample program data - in a real app, this would come from an API
  const programs = {
    1: {
      id: 1,
      title: "Elite Cricket Academy",
      description: "Comprehensive training program for aspiring professional cricketers",
      longDescription: "Our Elite Cricket Academy is designed for serious cricketers who want to take their game to the professional level. This intensive 6-month program combines technical skill development, tactical understanding, physical conditioning, and mental preparation to create well-rounded players ready for competitive cricket.",
      duration: "6 months",
      level: "Advanced",
      price: "$299/month",
      totalPrice: "$1,794",
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=400&fit=crop",
      features: ["Professional Coaching", "Match Analysis", "Fitness Training", "Mental Conditioning"],
      coach: {
        name: "John Smith",
        experience: "15 years",
        specialization: "Former International Player",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      rating: 4.8,
      students: 45,
      schedule: [
        { day: "Monday", time: "6:00 AM - 8:00 AM", activity: "Batting Practice" },
        { day: "Tuesday", time: "6:00 AM - 8:00 AM", activity: "Bowling Techniques" },
        { day: "Wednesday", time: "6:00 AM - 8:00 AM", activity: "Fielding Drills" },
        { day: "Thursday", time: "6:00 AM - 8:00 AM", activity: "Match Simulation" },
        { day: "Friday", time: "6:00 AM - 8:00 AM", activity: "Fitness Training" },
        { day: "Saturday", time: "8:00 AM - 12:00 PM", activity: "Practice Match" }
      ],
      curriculum: [
        {
          week: "Weeks 1-4",
          title: "Foundation Building",
          topics: ["Technical Assessment", "Basic Skill Refinement", "Fitness Baseline", "Mental Preparation Introduction"]
        },
        {
          week: "Weeks 5-12",
          title: "Skill Development",
          topics: ["Advanced Batting Techniques", "Bowling Variations", "Fielding Positions", "Game Awareness"]
        },
        {
          week: "Weeks 13-20",
          title: "Match Application",
          topics: ["Tactical Understanding", "Pressure Situations", "Team Dynamics", "Performance Analysis"]
        },
        {
          week: "Weeks 21-24",
          title: "Performance Optimization",
          topics: ["Individual Specialization", "Match Preparation", "Career Guidance", "Final Assessment"]
        }
      ],
      testimonials: [
        {
          name: "Michael Johnson",
          text: "This program transformed my game completely. The coaching quality is exceptional!",
          rating: 5
        },
        {
          name: "Sarah Williams",
          text: "Best investment I made for my cricket career. Highly recommended!",
          rating: 5
        }
      ],
      facilities: [
        "Professional Cricket Ground",
        "Indoor Nets Facility",
        "Fitness Center",
        "Video Analysis Room",
        "Equipment Provided",
        "Changing Rooms"
      ]
    },
    2: {
      id: 2,
      title: "Youth Development Program",
      description: "Perfect for young cricketers aged 8-16 to build fundamental skills",
      longDescription: "Our Youth Development Program is specially designed for young cricketers aged 8-16 who are just starting their cricket journey or want to improve their fundamental skills. We focus on creating a fun, safe, and encouraging environment where children can learn the basics of cricket while developing a love for the game.",
      duration: "3 months",
      level: "Beginner to Intermediate",
      price: "$199/month",
      totalPrice: "$597",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
      features: ["Basic Techniques", "Team Play", "Equipment Training", "Fun Activities"],
      coach: {
        name: "Sarah Johnson",
        experience: "10 years",
        specialization: "Youth Development Specialist",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
      },
      rating: 4.9,
      students: 78,
      schedule: [
        { day: "Monday", time: "4:00 PM - 5:30 PM", activity: "Basic Batting" },
        { day: "Wednesday", time: "4:00 PM - 5:30 PM", activity: "Bowling Basics" },
        { day: "Friday", time: "4:00 PM - 5:30 PM", activity: "Fielding & Games" },
        { day: "Saturday", time: "9:00 AM - 11:00 AM", activity: "Mini Matches" }
      ],
      curriculum: [
        {
          week: "Weeks 1-3",
          title: "Introduction to Cricket",
          topics: ["Equipment Familiarization", "Basic Rules", "Safety Guidelines", "Fun Games"]
        },
        {
          week: "Weeks 4-8",
          title: "Fundamental Skills",
          topics: ["Batting Stance", "Basic Bowling", "Catching", "Throwing Techniques"]
        },
        {
          week: "Weeks 9-12",
          title: "Game Application",
          topics: ["Mini Matches", "Team Work", "Sportsmanship", "Skill Assessment"]
        }
      ],
      testimonials: [
        {
          name: "Parent - Lisa Chen",
          text: "My son loves coming to practice. Great program for kids!",
          rating: 5
        },
        {
          name: "Parent - David Miller",
          text: "Excellent coaches who really care about the children's development.",
          rating: 5
        }
      ],
      facilities: [
        "Youth-Friendly Ground",
        "Soft Ball Training",
        "Child-Safe Equipment",
        "Parent Viewing Area",
        "First Aid Facilities",
        "Snack Bar"
      ]
    }
  };

  const program = programs[id] || programs[1]; // Default to first program if ID not found

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#0D13CC] to-[#42ADF5] text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div 
          className="relative bg-cover bg-center py-24"
          style={{ backgroundImage: `url(${program.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D13CC]/90 to-[#42ADF5]/90"></div>
          <div className="relative container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="flex items-center mb-4">
                <Link to="/program" className="text-blue-200 hover:text-[#D88717] mr-2">
                  ← Back to Programs
                </Link>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                  {program.level}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {program.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl">
                {program.description}
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <span className="text-sm text-blue-200">Duration</span>
                  <div className="font-bold text-lg">{program.duration}</div>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <span className="text-sm text-blue-200">Students</span>
                  <div className="font-bold text-lg">{program.students} enrolled</div>
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <span className="text-sm text-blue-200">Rating</span>
                  <div className="font-bold text-lg">★ {program.rating}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Program Overview */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Program Overview</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {program.longDescription}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {program.features.map((feature, index) => (
                  <div key={index} className="bg-[#42ADF5]/10 p-4 rounded-lg text-center">
                    <div className="text-[#0D13CC] font-semibold text-sm">{feature}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Schedule */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Training Schedule</h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Day</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Time</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Activity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {program.schedule.map((session, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold text-gray-800">{session.day}</td>
                          <td className="px-6 py-4 text-gray-600">{session.time}</td>
                          <td className="px-6 py-4 text-gray-600">{session.activity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Curriculum */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Curriculum</h2>
              <div className="space-y-6">
                {program.curriculum.map((phase, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-[#0D13CC] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4">
                        {index + 1}
                      </div>
    <div>
                        <h3 className="text-xl font-bold text-gray-800">{phase.title}</h3>
                        <p className="text-sm text-gray-500">{phase.week}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {phase.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="flex items-center">
                          <span className="text-[#D88717] mr-2">✓</span>
                          <span className="text-gray-600">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Facilities */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Facilities & Equipment</h2>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-[#D88717] mr-3">✓</span>
                      <span className="text-gray-700">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">What Students Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {program.testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="text-yellow-500 text-lg">
                        {"★".repeat(testimonial.rating)}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                    <p className="font-semibold text-gray-800">- {testimonial.name}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Pricing Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-[#D88717] mb-2">{program.price}</div>
                <div className="text-gray-500">Total: {program.totalPrice}</div>
              </div>
              
              <div className="space-y-4 mb-6">
                <Link 
                  to={`/enrollment?program=${program.id}`}
                  className="w-full bg-[#0D13CC] hover:bg-[#0D13CC]/80 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-colors duration-200 text-center block"
                >
                  Enroll Now
                </Link>
                <button className="w-full border-2 border-[#42ADF5] text-[#42ADF5] hover:bg-[#42ADF5] hover:text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200">
                  Book Free Trial
                </button>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold text-gray-800 mb-4">Need Help?</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>📞 Call: +1 (555) 123-4567</div>
                  <div>📧 Email: info@cricketxpert.com</div>
                  <div>💬 Live Chat Available</div>
                </div>
              </div>
            </div>

            {/* Coach Profile */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Coach</h3>
              <div className="flex items-center mb-4">
                <img 
                  src={program.coach.image} 
                  alt={program.coach.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-800">{program.coach.name}</h4>
                  <p className="text-sm text-gray-600">{program.coach.specialization}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>Experience:</strong> {program.coach.experience}</p>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Facts</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{program.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Level:</span>
                  <span className="font-semibold">{program.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Students:</span>
                  <span className="font-semibold">{program.students}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <span className="font-semibold">★ {program.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgramDetails;





