import { Link } from 'react-router-dom';
import { Zap, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#020617]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">NexusTeam</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-md mb-4">
              A multi-disciplinary creative team bringing together developers, interior designers, 
              and data analysts to deliver exceptional digital and physical experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/portfolio" className="text-sm text-gray-400 hover:text-indigo-400 transition">Portfolio</Link></li>
              <li><Link to="/team" className="text-sm text-gray-400 hover:text-indigo-400 transition">Our Team</Link></li>
              <li><Link to="/company" className="text-sm text-gray-400 hover:text-indigo-400 transition">Company Portal</Link></li>
              <li><Link to="/login" className="text-sm text-gray-400 hover:text-indigo-400 transition">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-gray-400">Full Stack Development</span></li>
              <li><span className="text-sm text-gray-400">Interior Design</span></li>
              <li><span className="text-sm text-gray-400">Data Analytics</span></li>
              <li><span className="text-sm text-gray-400">UI/UX Design</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">© 2026 NexusTeam. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
