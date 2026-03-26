import React from 'react';
import { Lock } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPolicyPage() {
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
                <Lock size={28} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-trawell-green">Privacy Policy</h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Last Updated: February 2026</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-8 md:p-10 text-gray-700 leading-relaxed text-sm sm:text-base space-y-6 md:space-y-8">
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">1. INTRODUCTION</h3>
                <p>
                  Welcome to Adrith Trawell Pvt Ltd("Company", "we", "us", or "our"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and your rights in relation to it.
                </p>
                <p className="mt-2">
                  This policy applies to all information collected through our website, mobile application, and any related services, sales, marketing, or events.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">2. INFORMATION WE COLLECT</h3>
                <p className="mb-2">We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, or otherwise contact us.</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Personal Information:</strong> We collect names; phone numbers; email addresses; mailing addresses; billing addresses; and debit/credit card numbers (processed securely via payment gateways).</li>
                    <li><strong>Travel Documents:</strong> For booking hotels and transport, we may collect government-issued ID proofs (Aadhar Card, Passport, etc.).</li>
                    <li><strong>Technical Data:</strong> We automatically collect certain information when you visit, use, or navigate the Site. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Site, and other technical information.</li>
                    <li><strong>Firebase & Analytics:</strong> We use Google Firebase and other analytics tools to understand user behavior and improve our app performance.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">3. HOW WE USE YOUR INFORMATION</h3>
                <p className="mb-2">We use personal information collected via our Site for a variety of business purposes described below:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>To facilitate account creation and logon process:</strong> If you choose to link your account with us to a third-party account (such as your Google or Facebook account), we use the information you allowed us to collect from those third parties to facilitate account creation and logon performance.</li>
                    <li><strong>To fulfill and manage your orders:</strong> We use your information to book flights, hotels, and transport, and to process payments, returns, and exchanges.</li>
                    <li><strong>To deliver services to the user:</strong> Including sending you trip itineraries, updates, and safety information.</li>
                    <li><strong>To improve our AI Models:</strong> Anonymized usage data is used to train our recommendation engines to suggest better "Hidden Gems" and travel circuits.</li>
                    <li><strong>To respond to legal requests and prevent harm:</strong> If we receive a subpoena or other legal request, we may need to inspect the data we hold to determine how to respond.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">4. WILL YOUR INFORMATION BE SHARED WITH ANYONE?</h3>
                <p className="mb-2">We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Vendors, Consultants, and Other Third-Party Service Providers:</strong> We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work. Examples include payment processing, data analysis, email delivery, hosting services, customer service, and marketing efforts.</li>
                    <li><strong>Travel Partners:</strong> We share necessary details (Name, ID Proof) with hotels, bus operators, and tour guides strictly for the purpose of fulfilling your booking.</li>
                    <li><strong>Legal Obligations:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">5. HOW LONG DO WE KEEP YOUR INFORMATION?</h3>
                <p>
                  We keep your information for as long as necessary to fulfill the purposes outlined in this privacy policy unless otherwise required by law.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">6. HOW DO WE KEEP YOUR INFORMATION SAFE?</h3>
                <p>
                  We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our Site is at your own risk.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">7. GOVERNING LAW</h3>
                <p>
                  This Privacy Policy is governed by the laws of India. Any disputes arising under this Policy shall be subject to the exclusive jurisdiction of the courts in Gautam Buddha Nagar (Greater Noida), Uttar Pradesh.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3">8. CONTACT US / GRIEVANCE OFFICER</h3>
                <p className="mb-2">In accordance with the Information Technology Act, 2000 and rules made there under, the name and contact details of the Grievance Officer are provided below:</p>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p><strong>Name:</strong> Jayesh Anand</p>
                    <p><strong>Address:</strong> 83/1 Lane no-3, Sadbhaw Kunj, Panditwari, Dehradun, Uttrakhand, India</p>
                    <p><strong>Email:</strong> trawell.work@gmail.com</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
