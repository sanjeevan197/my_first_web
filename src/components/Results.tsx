import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { nadiAPI } from '../services/api';
import { User } from 'firebase/auth';

interface ResultsProps {
  user: User;
}

interface Report {
  id: string;
  date: string;
  vata: number;
  pitta: number;
  kapha: number;
  status: string;
  recommendations: string[];
}

export const Results: React.FC<ResultsProps> = ({ user }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await nadiAPI.getReports(user.uid);
        setReports(response.data || []);
      } catch (error) {
        console.error('Error fetching reports:', error);
        // Mock data for demo
        setReports([
          {
            id: '1',
            date: new Date().toLocaleDateString(),
            vata: 45,
            pitta: 30,
            kapha: 25,
            status: 'High Vata Imbalance',
            recommendations: [
              'Practice calming yoga poses',
              'Eat warm, cooked foods',
              'Maintain regular sleep schedule',
              'Use sesame oil for massage'
            ]
          }
        ]);
      }
      setLoading(false);
    };

    fetchReports();
  }, [user.uid]);

  const getDoshaColor = (dosha: string) => {
    switch (dosha.toLowerCase()) {
      case 'vata': return 'text-vata';
      case 'pitta': return 'text-pitta';
      case 'kapha': return 'text-kapha';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Analysis Results & History</h1>
        
        {reports.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">No analysis results yet. Start your first Nadi analysis!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Analysis Report</span>
                    <span className="text-sm text-gray-500">{report.date}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">Dosha Percentages</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className={getDoshaColor('vata')}>Vata:</span>
                          <span className="font-medium">{report.vata}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={getDoshaColor('pitta')}>Pitta:</span>
                          <span className="font-medium">{report.pitta}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={getDoshaColor('kapha')}>Kapha:</span>
                          <span className="font-medium">{report.kapha}%</span>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                        <p className="font-medium text-yellow-800">Status: {report.status}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">Ayurvedic Recommendations</h3>
                      <ul className="space-y-2">
                        {report.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};