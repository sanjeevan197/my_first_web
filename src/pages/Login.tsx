import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { nadiAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      console.log('🎉 Login Success!');
      console.log('🔐 Firebase JWT Token:', token);
      console.log('👤 User ID:', userCredential.user.uid);
      
      // Save user to database
      await nadiAPI.saveUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: userCredential.user.displayName || ''
      });
      
    } catch (error: any) {
      setError(error.message);
      console.error('Login error:', error);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const token = await userCredential.user.getIdToken();
      
      console.log('🎉 Google Login Success!');
      console.log('🔐 Firebase JWT Token:', token);
      
      await nadiAPI.saveUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: userCredential.user.displayName || ''
      });
      
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vata via-pitta to-kapha flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center text-white mb-6 hover:underline">
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </Link>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Login to Nadi Pariksha
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-4">
              <Button onClick={handleGoogleLogin} variant="outline" className="w-full">
                Continue with Google
              </Button>
            </div>
            
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Sign Up
                </Link>
              </p>
              <p className="text-sm">
                <Link to="/guest" className="text-gray-600 hover:underline">
                  🔍 Guest Access - View All Users
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};