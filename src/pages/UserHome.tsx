import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ProgressBar } from '../components/ProgressBar';
import { Activity, BarChart3, User, Heart, TrendingUp, Clock, Award } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { nadiAPI } from '../services/api';

interface UserHomeProps {
  user: FirebaseUser;
  notifications: {
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
  };
}

export const UserHome: React.FC<UserHomeProps> = ({ user, notifications }) => {
  const [stats, setStats] = useState({ totalAnalysis: 0, lastAnalysis: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserStats = async () => {
      try {
        const response = await nadiAPI.getReports(user.uid);
        setStats({
          totalAnalysis: response.data.length,
          lastAnalysis: response.data[0]?.date || null
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserStats();
    notifications.success(`Welcome back, ${user.displayName || 'User'}!`);
  }, [user, notifications]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome, {user.displayName || 'User'}
          </h1>
          <p className="text-xl text-gray-600">
            Your Ayurvedic Health Dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Analysis</p>
                  <p className="text-2xl font-bold text-vata">{loading ? '...' : stats.totalAnalysis}</p>
                </div>
                <TrendingUp className="text-vata" size={32} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Last Analysis</p>
                  <p className="text-lg font-semibold text-pitta">{stats.lastAnalysis || 'None'}</p>
                </div>
                <Clock className="text-pitta" size={32} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Health Score</p>
                  <p className="text-2xl font-bold text-kapha">85%</p>
                </div>
                <Award className="text-kapha" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/analysis">
            <Card className="hover-lift shadow-glow cursor-pointer group">
              <CardHeader>
                <Activity className="mx-auto mb-4 text-vata animate-float group-hover:scale-110 transition-transform" size={48} />
                <CardTitle className="text-center gradient-text">Start Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 mb-4">
                  Begin your Nadi Pariksha pulse analysis
                </p>
                <ProgressBar progress={100} className="mb-2" />
                <p className="text-xs text-center text-gray-500">Ready to start</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/results">
            <Card className="hover-lift shadow-glow cursor-pointer group">
              <CardHeader>
                <BarChart3 className="mx-auto mb-4 text-pitta animate-float group-hover:scale-110 transition-transform" size={48} />
                <CardTitle className="text-center gradient-text">View Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 mb-4">
                  Check your analysis history and reports
                </p>
                <ProgressBar progress={stats.totalAnalysis > 0 ? 100 : 0} className="mb-2" />
                <p className="text-xs text-center text-gray-500">
                  {stats.totalAnalysis} analysis completed
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/profile">
            <Card className="hover-lift shadow-glow cursor-pointer group">
              <CardHeader>
                <User className="mx-auto mb-4 text-kapha animate-float group-hover:scale-110 transition-transform" size={48} />
                <CardTitle className="text-center gradient-text">Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 mb-4">
                  Manage your account settings
                </p>
                <ProgressBar progress={user.displayName ? 100 : 50} className="mb-2" />
                <p className="text-xs text-center text-gray-500">
                  Profile {user.displayName ? 'complete' : 'incomplete'}
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Enhanced About Section */}
        <Card className="mb-8 glass-effect border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Heart className="mr-2 text-red-500 animate-pulse" />
              <span className="gradient-text">About Nadi Pariksha</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-lg bg-vata/10 hover-lift">
                <div className="w-16 h-16 mx-auto mb-4 bg-vata/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-vata">V</span>
                </div>
                <h3 className="font-semibold text-vata mb-2">Vata Dosha</h3>
                <p className="text-sm text-gray-600">Controls movement and nervous system</p>
                <ProgressBar progress={33} className="mt-3" showPercentage={false} />
              </div>
              <div className="text-center p-6 rounded-lg bg-pitta/10 hover-lift">
                <div className="w-16 h-16 mx-auto mb-4 bg-pitta/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-pitta">P</span>
                </div>
                <h3 className="font-semibold text-pitta mb-2">Pitta Dosha</h3>
                <p className="text-sm text-gray-600">Governs digestion and metabolism</p>
                <ProgressBar progress={33} className="mt-3" showPercentage={false} />
              </div>
              <div className="text-center p-6 rounded-lg bg-kapha/10 hover-lift">
                <div className="w-16 h-16 mx-auto mb-4 bg-kapha/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-kapha">K</span>
                </div>
                <h3 className="font-semibold text-kapha mb-2">Kapha Dosha</h3>
                <p className="text-sm text-gray-600">Maintains structure and immunity</p>
                <ProgressBar progress={34} className="mt-3" showPercentage={false} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};