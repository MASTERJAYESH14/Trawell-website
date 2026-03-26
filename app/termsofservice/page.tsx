import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function TermsOfServicePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-trawell-bg flex flex-col">
      <Navbar 
        onAuthClick={() => {}} 
        onProfileClick={() => {}}
        onMyTripsClick={() => {}}
        onLogoClick={() => navigate('/')}
      />
      
      <main className="flex-grow pt-24 md:pt-28 pb-12 md:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 px-5 sm:px-8 md:px-10 py-6 md:py-8 border-b border-gray-100 bg-gray-50/50">
              <div className="p-3 bg-trawell-orange/10 rounded-xl text-trawell-orange shrink-0">
                <ShieldAlert size={28} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-trawell-green">Terms of Service</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Last Updated: February 2026</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-8 md:p-10 text-gray-700 leading-relaxed text-sm sm:text-base space-y-6 md:space-y-8">
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">1. AGREEMENT TO TERMS</h3>
                <p>
                  These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Adrith Trawell Pvt Ltd (“Company”, “we”, “us”, or “our”), concerning your access to and use of the Trawell website and mobile application. By accessing the Site, you agree that you have read, understood, and agreed to be bound by all of these Terms of Service.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">2. THE SERVICES</h3>
                <p>
                  Trawell provides curated travel experiences, itinerary planning, and booking facilitation services. We act as an aggregator connecting travelers with third-party service providers (hotels, transport operators, guides).
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">3. BOOKINGS AND FINANCIALS</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Payment Policy:</strong> To confirm a slot on any Trawell curated trip, a 100% advance payment is required unless otherwise specified in a "Part-Payment" offer.</li>
                  <li><strong>Price Fluctuations:</strong> Prices for trips are dynamic and subject to change based on vendor rates (e.g., fuel price hikes, hotel seasonality) until the booking is confirmed.</li>
                  <li><strong>Inclusions/Exclusions:</strong> Your booking fee covers only the specific items listed in the "Inclusions" section of the trip itinerary. Personal expenses, extra meals, and emergency costs are the traveler's responsibility.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">4. CANCELLATION AND REFUND POLICY</h3>
                <p className="mb-4">
                  At Trawell, we understand that plans can change. However, as a curator of group experiences, we pre-book services (accommodation, transport, and experiences) well in advance. Therefore, our refund policy is structured to reflect the commitments we make to our vendors.
                </p>
                
                <div className="space-y-4 pl-4 border-l-2 border-trawell-orange/20">
                    <div>
                        <h4 className="font-bold text-gray-800">1. Trip-Specific Policies Override Standard Rules</h4>
                        <p className="text-sm mt-1">Please note that cancellation fees and refund eligibility vary by package. The specific cancellation policy mentioned on your trip itinerary, booking page, or invoice takes precedence over this general policy.</p>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-800">2. Standard Cancellation Framework</h4>
                        <p className="text-sm mt-1 mb-2">In the absence of a specific policy on your booking voucher, the following standard deductions apply:</p>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                            <li><strong>Administrative Fee:</strong> A non-refundable administrative fee (typically 10-15% of the booking value) applies to all cancellations to cover payment gateway charges and processing overheads.</li>
                            <li><strong>Third-Party Deductions:</strong> Refunds are subject to the cancellation policies of our third-party vendors (hotels, airlines, bus operators). If a vendor does not refund Trawell, we cannot refund the traveler for that portion of the fee.</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-800">3. Refund Processing Timeline</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
                            <li>Approved refunds will be processed within 7-10 business days back to the original source of payment.</li>
                            <li>Trawell is not liable for delays caused by banking intermediaries.</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-800">4. Non-Refundable Scenarios</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
                            <li>No-shows or late arrivals to the departure point.</li>
                            <li>Trips cut short by the traveler for personal reasons.</li>
                            <li>Booking amounts designated as "Non-Refundable Deposits" at the time of payment.</li>
                            <li><strong>Force Majeure:</strong> In the event a trip is cancelled due to natural disasters, pandemics, government lockdowns, or other "Acts of God," Trawell will issue a Credit Note valid for 12 months for future trips, minus any non-refundable vendor advances.</li>
                        </ul>
                    </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">5. USER CONDUCT & SAFETY (Zero Tolerance Policy)</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Harassment:</strong> Trawell maintains a strict policy against sexual harassment, bullying, or discrimination. Any participant found violating this will be removed from the trip immediately without refund.</li>
                    <li><strong>Substance Abuse:</strong> Possession or use of illegal drugs/narcotics during a Trawell trip is strictly prohibited and will be reported to local authorities.</li>
                    <li><strong>Damage to Property:</strong> You are liable for any damage caused to hotel property, vehicles, or heritage sites due to your negligence.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">6. INTELLECTUAL PROPERTY RIGHTS</h3>
                <p>
                  The "Trawell" name, logo, the "Hidden Gems" curation methodology, and the underlying code of our platform (including our AI models and database schemas) are the exclusive intellectual property of the Company. You are granted a limited license to access the Site for personal use only.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">7. LIMITATION OF LIABILITY</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Assumption of Risk:</strong> You acknowledge that travel, especially to heritage and remote locations, involves inherent risks (e.g., uneven terrain, weather changes). You voluntarily assume all such risks.</li>
                    <li><strong>Third-Party Failure:</strong> Trawell is not liable for acts, errors, omissions, representations, warranties, breaches, or negligence of any third-party suppliers (hotels, bus operators) or for any personal injuries, death, property damage, or other damages or expenses resulting there from.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">8. GOVERNING LAW</h3>
                <p>
                  These Terms shall be governed by and defined following the laws of India. Trawell and yourself irrevocably consent that the courts of Gautam Buddha Nagar (Greater Noida), Uttar Pradesh, shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
