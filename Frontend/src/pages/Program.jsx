import React from "react";
import { Link } from "react-router-dom";

function Program() {
  const programs = [
    {
      id: 1,
      title: "Elite Cricket Academy",
      description: "Comprehensive training program for aspiring professional cricketers",
      duration: "6 months",
      level: "Advanced",
      price: "$299/month",
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=250&fit=crop",
      features: ["Professional Coaching", "Match Analysis", "Fitness Training", "Mental Conditioning"],
      coach: "John Smith",
      rating: 4.8,
      students: 45
    },
    {
      id: 2,
      title: "Youth Development Program",
      description: "Perfect for young cricketers aged 8-16 to build fundamental skills",
      duration: "3 months",
      level: "Beginner to Intermediate",
      price: "$199/month",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      features: ["Basic Techniques", "Team Play", "Equipment Training", "Fun Activities"],
      coach: "Sarah Johnson",
      rating: 4.9,
      students: 78
    },
    {
      id: 3,
      title: "Weekend Warrior",
      description: "Flexible training for working professionals and busy schedules",
      duration: "Ongoing",
      level: "All Levels",
      price: "$149/month",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=250&fit=crop",
      features: ["Weekend Sessions", "Flexible Timing", "Skill Assessment", "Group Training"],
      coach: "Mike Wilson",
      rating: 4.7,
      students: 32
    },
    {
      id: 4,
      title: "Fast Bowling Specialist",
      description: "Intensive program focused on developing pace bowling techniques",
      duration: "4 months",
      level: "Intermediate to Advanced",
      price: "$249/month",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      features: ["Bowling Mechanics", "Speed Training", "Injury Prevention", "Match Strategies"],
      coach: "David Brown",
      rating: 4.6,
      students: 28
    },
    {
      id: 5,
      title: "Batting Masterclass",
      description: "Advanced batting techniques and shot selection training",
      duration: "5 months",
      level: "Intermediate to Advanced",
      price: "$279/month",
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=250&fit=crop",
      features: ["Shot Technique", "Mental Approach", "Match Situations", "Video Analysis"],
      coach: "Alex Taylor",
      rating: 4.8,
      students: 41
    },
    {
      id: 6,
      title: "Wicket Keeping Academy",
      description: "Specialized training for aspiring wicket keepers",
      duration: "4 months",
      level: "All Levels",
      price: "$229/month",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=250&fit=crop",
      features: ["Glove Work", "Positioning", "Stumping Techniques", "Communication"],
      coach: "Chris Evans",
      rating: 4.7,
      students: 19
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0D13CC] to-[#42ADF5] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Cricket Coaching Programs
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Elevate your cricket skills with our expert-led training programs designed for all skill levels
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              <div className="bg-[#D88717]/30 px-4 py-2 rounded-full">
                <span className="font-semibold">Professional Coaches</span>
              </div>
              <div className="bg-[#D88717]/30 px-4 py-2 rounded-full">
                <span className="font-semibold">Modern Facilities</span>
              </div>
              <div className="bg-[#D88717]/30 px-4 py-2 rounded-full">
                <span className="font-semibold">Proven Results</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Choose Your Program
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From beginner fundamentals to advanced techniques, find the perfect program to match your goals and skill level
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <div key={program.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={program.image} 
                  alt={program.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-[#D88717] px-3 py-1 rounded-full text-sm font-semibold text-white">
                  {program.level}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{program.title}</h3>
                  <div className="flex items-center text-yellow-500">
                    <span className="text-sm font-semibold mr-1">★</span>
                    <span className="text-sm text-gray-600">{program.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {program.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-semibold">{program.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Coach:</span>
                    <span className="font-semibold">{program.coach}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Students:</span>
                    <span className="font-semibold">{program.students} enrolled</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Program Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {program.features.map((feature, index) => (
                      <span key={index} className="bg-[#42ADF5]/20 text-[#0D13CC] text-xs px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-[#D88717]">
                    {program.price}
                  </div>
                  <Link 
                    to={`/program/${program.id}`}
                    className="bg-[#0D13CC] hover:bg-[#0D13CC]/80 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Cricket Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of players who have improved their game with our expert coaching programs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#D88717] hover:bg-[#D88717]/80 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200">
              Book Free Trial
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-gray-800 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Program;





