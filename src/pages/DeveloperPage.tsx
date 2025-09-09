import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Code, Github, Mail, Linkedin } from 'lucide-react';

export const DeveloperPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Code className="mx-auto mb-4 text-blue-600" size={64} />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Developer Information</h1>
          <p className="text-xl text-gray-600">About the Nadi Pariksha Application</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Technology Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><strong>Frontend:</strong> React 18 + TypeScript</li>
                <li><strong>Styling:</strong> Tailwind CSS</li>
                <li><strong>Authentication:</strong> Firebase Auth</li>
                <li><strong>Database:</strong> MySQL</li>
                <li><strong>Backend:</strong> Node.js + Express</li>
                <li><strong>Charts:</strong> Recharts</li>
                <li><strong>Build Tool:</strong> Vite</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>• Real-time pulse analysis</li>
                <li>• Dosha balance detection</li>
                <li>• User authentication & profiles</li>
                <li>• Admin dashboard</li>
                <li>• Analysis history</li>
                <li>• Responsive design</li>
                <li>• JWT security</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About the Developer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Code className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Full Stack Developer</h3>
              <p className="text-gray-600 mb-4">
                Specialized in React, Node.js, and modern web technologies. 
                Passionate about creating healthcare solutions using technology.
              </p>
              
              <div className="flex justify-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Github size={20} />
                  <span>GitHub</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail size={20} />
                  <span>Email</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <p><strong>Frontend:</strong> React SPA with TypeScript for type safety</p>
              <p><strong>Authentication:</strong> Firebase Auth with JWT tokens</p>
              <p><strong>Database:</strong> MySQL for reliable data storage</p>
              <p><strong>API:</strong> RESTful endpoints with Express.js</p>
              <p><strong>Security:</strong> JWT-based authentication and authorization</p>
              <p><strong>Deployment:</strong> Ready for production deployment</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};