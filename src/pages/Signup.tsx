import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { nadiAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';

export const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      console.log('🎉 Signup Success!');
      console.log('🔐 Firebase JWT Token:', token);
      console.log('👤 User ID:', userCredential.user.uid);
      
      // Save user to database
      await nadiAPI.saveUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: displayName || userCredential.user.displayName || ''
      });
      
    } catch (error: any) {
      setError(error.message);
      console.error('Signup error:', error);
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const token = await userCredential.user.getIdToken();
      
      console.log('🎉 Google Signup Success!');
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
              Create Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSignup} className="space-y-4">
              <Input
                type="text"
                placeholder="Full Name (Optional)"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
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
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            
            <div className="mt-4">
              <Button onClick={handleGoogleSignup} variant="outline" className="w-full">
                Sign up with Google
              </Button>
            </div>
            
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign In
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