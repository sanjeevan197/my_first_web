import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Activity, Users, BarChart3, Shield } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-green-50">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Nadi Pariksha
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Advanced Ayurvedic Pulse Analysis System for Vata, Pitta, and Kapha Dosha Balance Detection
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="bg-gradient-to-r from-vata to-pitta text-white">
                Get Started
              </Button>
            </Link>
            <Link to="/guest">
              <Button variant="outline" size="lg">
                Guest Access
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Activity className="mx-auto mb-2 text-vata" size={48} />
              <CardTitle>Real-time Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Live pulse waveform monitoring and instant dosha analysis</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="mx-auto mb-2 text-pitta" size={48} />
              <CardTitle>Detailed Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Comprehensive analysis reports with Ayurvedic recommendations</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="mx-auto mb-2 text-kapha" size={48} />
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Secure user profiles with complete analysis history</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="mx-auto mb-2 text-purple-600" size={48} />
              <CardTitle>Firebase Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">JWT-based authentication with Firebase integration</p>
            </CardContent>
          </Card>
        </div>

        {/* About Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-center text-2xl">About Nadi Pariksha</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="font-semibold text-vata mb-2">Vata Dosha</h3>
                <p className="text-sm text-gray-600">Controls movement, breathing, and nervous system functions</p>
              </div>
              <div>
                <h3 className="font-semibold text-pitta mb-2">Pitta Dosha</h3>
                <p className="text-sm text-gray-600">Governs digestion, metabolism, and body temperature</p>
              </div>
              <div>
                <h3 className="font-semibold text-kapha mb-2">Kapha Dosha</h3>
                <p className="text-sm text-gray-600">Maintains structure, immunity, and body fluids</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};