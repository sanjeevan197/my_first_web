import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { TokenDisplay } from './TokenDisplay';
import { nadiAPI } from '../services/api';
import { User } from 'firebase/auth';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [doshaData, setDoshaData] = useState([
    { name: 'Vata', value: 33, color: '#8B5CF6' },
    { name: 'Pitta', value: 33, color: '#F59E0B' },
    { name: 'Kapha', value: 34, color: '#10B981' }
  ]);
  
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jwtToken, setJwtToken] = useState<string>('');

  useEffect(() => {
    const getToken = async () => {
      if (user) {
        const token = await user.getIdToken();
        setJwtToken(token);
        console.log('Firebase JWT Token:', token);
      }
    };
    getToken();
  }, [user]);

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // Generate mock waveform data
      const mockWaveform = Array.from({ length: 100 }, (_, i) => 
        Math.sin(i * 0.1) * 50 + Math.random() * 20
      );
      setWaveformData(mockWaveform);
      
      // Simulate analysis with mock data
      setTimeout(() => {
        const mockResults = {
          vata: Math.floor(Math.random() * 30) + 30,
          pitta: Math.floor(Math.random() * 30) + 25,
          kapha: Math.floor(Math.random() * 30) + 25
        };
        
        setDoshaData([
          { name: 'Vata', value: mockResults.vata, color: '#8B5CF6' },
          { name: 'Pitta', value: mockResults.pitta, color: '#F59E0B' },
          { name: 'Kapha', value: mockResults.kapha, color: '#10B981' }
        ]);
        setIsAnalyzing(false);
      }, 3000);
    } catch (error) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
    }
  };

  const chartData = waveformData.map((value, index) => ({ x: index, y: value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user.displayName || user.email}
          </h1>
          <p className="text-gray-600">Ayurvedic Pulse Analysis Dashboard</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Dosha Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={doshaData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {doshaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Live Pulse Waveform</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <XAxis dataKey="x" />
                  <YAxis />
                  <Line type="monotone" dataKey="y" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Nadi Analysis Control</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={startAnalysis} 
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-vata to-pitta text-white mb-4"
            >
              {isAnalyzing ? 'Analyzing...' : 'Start Nadi Analysis'}
            </Button>
          </CardContent>
        </Card>

        <TokenDisplay user={user} />
      </div>
    </div>
  );
};