import React from 'react';
import { Link } from 'react-router-dom';
import { signOut, User } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Button } from './ui/button';
import { LogOut, Home, BarChart3, Users, Activity } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ user, isAdmin = false, isSuperAdmin = false }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-gray-800 hover:text-primary">
              <img src="/nadi-icon.svg" alt="Nadi Pariksha" className="w-8 h-8" />
              <span>Nadi Pariksha</span>
            </Link>
            
            {user && (
              <div className="flex space-x-4">
                <Link to="/" className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                  <Home size={16} />
                  <span>Home</span>
                </Link>
                <Link to="/analysis" className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                  <Activity size={16} />
                  <span>Analysis</span>
                </Link>
                <Link to="/results" className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                  <BarChart3 size={16} />
                  <span>Results</span>
                </Link>
                <Link to="/profile" className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                  <Users size={16} />
                  <span>Profile</span>
                </Link>
                <Link to="/developer" className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                  <Users size={16} />
                  <span>Developer</span>
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center space-x-1 text-red-600 hover:text-red-800 font-medium">
                    <Users size={16} />
                    <span>Admin</span>
                  </Link>
                )}
                {isSuperAdmin && (
                  <Link to="/superadmin" className="flex items-center space-x-1 text-yellow-600 hover:text-yellow-800 font-bold">
                    <Users size={16} />
                    <span>Super Admin</span>
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-gray-600">
                  {isSuperAdmin && <span className="text-yellow-600 font-bold">[SUPER ADMIN] </span>}
                  {isAdmin && !isSuperAdmin && <span className="text-red-600 font-medium">[ADMIN] </span>}
                  {user.displayName || user.email}
                </span>
                <Button onClick={handleLogout} variant="ghost" size="sm" className="flex items-center space-x-2">
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};