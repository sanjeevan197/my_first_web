import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Nadi Pariksha</h3>
            <p className="text-gray-300 text-sm">
              Advanced Ayurvedic pulse analysis system for comprehensive dosha balance detection.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/login" className="text-gray-300 hover:text-white">Login</Link></li>
              <li><Link to="/signup" className="text-gray-300 hover:text-white">Sign Up</Link></li>
              <li><Link to="/guest" className="text-gray-300 hover:text-white">Guest Access</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Real-time Analysis</li>
              <li>Dosha Balance Detection</li>
              <li>Ayurvedic Recommendations</li>
              <li>User Management</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Technology</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>React + TypeScript</li>
              <li>Firebase Authentication</li>
              <li>MySQL Database</li>
              <li>JWT Security</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>&copy; 2024 Nadi Pariksha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};