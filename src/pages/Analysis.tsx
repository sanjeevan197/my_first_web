import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { nadiAPI } from '../services/api';
import { User } from 'firebase/auth';
import { Activity, Play, Square } from 'lucide-react';

interface AnalysisProps {
  user: User;
}

export const Analysis: React.FC<AnalysisProps> = ({ user }) => {
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const startRecording = async () => {
    setIsRecording(true);
    setWaveformData([]);
    
    try {
      await nadiAPI.startAnalysis();
      
      // Simulate real-time waveform data
      const interval = setInterval(() => {
        setWaveformData(prev => {
          const newData = [...prev, Math.sin(prev.length * 0.1) * 50 + Math.random() * 20];
          return newData.slice(-100); // Keep last 100 points
        });
      }, 100);

      // Auto-stop after 10 seconds
      setTimeout(() => {
        clearInterval(interval);
        setIsRecording(false);
      }, 10000);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const analyzeWaveform = async () => {
    if (waveformData.length === 0) {
      alert('Please record some data first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await nadiAPI.analyzeWaveform(waveformData);
      setAnalysisResult(response.data);
      console.log('Analysis complete:', response.data);
    } catch (error) {
      console.error('Analysis failed:', error);
    }
    setIsAnalyzing(false);
  };

  const chartData = waveformData.map((value, index) => ({ x: index, y: value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Live Nadi Analysis
          </h1>
          <p className="text-gray-600">Real-time pulse waveform monitoring and dosha analysis</p>
        </div>

        {/* Control Panel */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2" />
              Analysis Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={startRecording}
                disabled={isRecording}
                className="flex items-center gap-2"
              >
                <Play size={16} />
                {isRecording ? 'Recording...' : 'Start Recording'}
              </Button>
              
              <Button
                onClick={stopRecording}
                disabled={!isRecording}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Square size={16} />
                Stop Recording
              </Button>
              
              <Button
                onClick={analyzeWaveform}
                disabled={isAnalyzing || waveformData.length === 0}
                className="bg-gradient-to-r from-vata to-pitta text-white"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Waveform'}
              </Button>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              Status: {isRecording ? '🔴 Recording' : '⚫ Stopped'} | 
              Data Points: {waveformData.length} | 
              User: {user.email}
            </div>
          </CardContent>
        </Card>

        {/* Waveform Display */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Live Pulse Waveform</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="x" />
                  <YAxis />
                  <Line 
                    type="monotone" 
                    dataKey="y" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    dot={false}
                    animationDuration={0}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResult && (
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-vata mb-2">
                    {analysisResult.vata}%
                  </div>
                  <div className="text-sm text-gray-600">Vata Dosha</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pitta mb-2">
                    {analysisResult.pitta}%
                  </div>
                  <div className="text-sm text-gray-600">Pitta Dosha</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-kapha mb-2">
                    {analysisResult.kapha}%
                  </div>
                  <div className="text-sm text-gray-600">Kapha Dosha</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="font-medium text-yellow-800">
                  Status: {analysisResult.status}
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Analysis completed at {new Date().toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};