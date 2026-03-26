import React from 'react';
import { Gem, Cpu, Users, ShieldCheck, MapPin } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function AboutUsPage() {
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      title: 'The "Hidden Gems" Agenda',
      subtitle: 'Our core philosophy is simple: Go Deep.',
      description: 'While others stop at the main fort gate, we take you to the forgotten stepwells behind it. Trawell is built on the pursuit of "Hidden Gems"—locations, stories, and culinary secrets that don\'t make it to the standard travel blogs.',
      points: [
        { label: 'Beyond the Brochure', text: '50% famous landmarks, 50% secret discoveries curated by our scouts.' },
        { label: 'The Narrative Arc', text: 'Context, history, and local legends that make the stones speak.' }
      ],
      icon: Gem,
      colorClass: 'text-purple-600 bg-purple-50 border-purple-100'
    },
    {
      id: 2,
      title: 'Powered by Intelligence',
      subtitle: 'The AI Advantage',
      description: 'We are not a traditional agency; we are a tech company at heart. Founded by a Computer Science engineer, Trawell leverages cutting-edge technology to enhance your journey, not distract from it.',
      points: [
        { label: 'AI-Driven Discovery', text: 'Advanced detection engines identify photogenic spots manual research misses.' },
        { label: 'Smart Itineraries', text: 'Algorithms optimize routes so you spend less time in traffic.' },
        { label: 'The Trawell Ecosystem', text: 'Engineered for speed, reliability, and ease of use.' }
      ],
      icon: Cpu,
      colorClass: 'text-blue-600 bg-blue-50 border-blue-100'
    },
    {
      id: 3,
      title: 'Curation & Community',
      subtitle: "We don't sell tickets; we build tribes.",
      description: 'Our trips are designed for the youth—students, young professionals, and creatives. We strictly curate our groups to ensure a safe, inclusive, and high-energy environment.',
      points: [
        { label: 'Curated for Connection', text: 'Small groups (capped at 20) to foster genuine friendships.' },
        { label: 'Vibe Check', text: 'When you travel with Trawell, you aren\'t a tourist; you\'re part of a squad.' },
        { label: 'Safety First', text: 'Verified stays, trusted partners, and 24/7 on-ground support.' }
      ],
      icon: Users,
      colorClass: 'text-orange-600 bg-orange-50 border-orange-100'
    },
    {
      id: 4,
      title: 'Innovation & Trust',
      subtitle: 'Legally Incorporated & Transparent',
      description: 'Trawell is a registered corporate entity, comapny name "Adrith Trawell Pvt Ltd" . We operate with full legal compliance, corporate banking standards, and transparent policies.',
      points: [
        { label: 'Founder-Led Passion', text: 'Led by Jayesh Anand, a tech visionary who believes the best life lessons are learned on the road.' }
      ],
      icon: ShieldCheck,
      colorClass: 'text-green-600 bg-green-50 border-green-100'
    }
  ];

  return (
    <div className="min-h-screen bg-trawell-bg flex flex-col">
      <Navbar 
        onAuthClick={() => {}} 
        onProfileClick={() => {}}
        onMyTripsClick={() => {}}
        onLogoClick={() => navigate('/')}
      />
      
      <main className="flex-grow pt-24 md:pt-28 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <section className="relative overflow-hidden bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 py-10 md:py-16">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-trawell-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-trawell-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
              
              {/* Header Section */}
              <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-trawell-green/10 text-trawell-green font-bold text-xs uppercase tracking-wider mb-4">
                   <MapPin size={14} />
                   <span>Dehradun, Uttarakhand, India</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-trawell-green mb-4 md:mb-6 font-cursive leading-tight">
                  We Don't Just Travel. <span className="text-trawell-orange">We Discover.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium mb-3 md:mb-4">
                  Welcome to Trawell.
                </p>
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  Born by travel community, and fueled by wanderlust, Trawell is India’s first tech-native experiential travel company. We exist to solve the biggest problem in modern tourism: the "Checklist Trap." Most people travel to see what everyone else has seen. We travel to find what everyone else has missed.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
                {features.map((feature) => (
                  <div 
                    key={feature.id} 
                    className={`rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white ${feature.colorClass.replace('text-', 'border-').split(' ')[2]}`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${feature.colorClass.split(' ')[1]} ${feature.colorClass.split(' ')[0]}`}>
                        <feature.icon size={24} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                        <p className={`font-medium text-sm ${feature.colorClass.split(' ')[0]}`}>{feature.subtitle}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base">
                      {feature.description}
                    </p>

                    <div className="space-y-3">
                      {feature.points.map((point, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${feature.colorClass.split(' ')[0].replace('text-', 'bg-')}`} />
                          <p className="text-sm text-gray-700">
                            <span className="font-bold text-gray-900">{point.label}:</span> {point.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Footer Note */}
              <div className="mt-12 md:mt-16 text-center border-t border-gray-100 pt-8 md:pt-10">
                 <p className="text-gray-500 italic font-medium text-base md:text-lg">
                   "The best code is written in the office, but the best life lessons are learned on the road."
                 </p>
                 <p className="text-trawell-green font-bold mt-2 text-sm md:text-base">— Jayesh Anand, Founder</p>
              </div>

            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
