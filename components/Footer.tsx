
import React from 'react';
import { CompassLogo } from './ui/CompassLogo';
import { Instagram, Facebook, Mail, MessageCircle, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-trawell-green text-white py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <CompassLogo size={32} className="opacity-90" />
              <span className="text-xl font-bold">Trawell</span>
            </div>
            <p className="text-sm text-white/60">
              Building a future where every journey is seamless and exploring the unknown is as easy as tapping a screen.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-trawell-orange">Company</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link to="/aboutus" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-trawell-orange">Contact Us</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li>
                <a href="mailto:info@trawell.tech" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Mail size={16} className="text-trawell-orange" />
                  <span>info@trawell.tech</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/919056454920" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <MessageCircle size={16} className="text-trawell-orange" />
                  <span>+91 90564 54920</span>
                </a>
              </li>
              <li className="pt-2">
                <Link to="/termsofservice" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacypolicy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-trawell-orange">Social</h4>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/travelwithtrawell/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/company/trawell-with-us/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61574977721560" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-sm text-white/40">
          © {new Date().getFullYear()} Adrith Trawell Pvt Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
