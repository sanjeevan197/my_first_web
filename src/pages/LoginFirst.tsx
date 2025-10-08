import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { perfectAuthAPI } from '../services/authAPI';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

export const LoginFirst: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let userCredential;
      
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      
      await perfectAuthAPI.syncUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: displayName || userCredential.user.displayName || '',
        emailVerified: userCredential.user.emailVerified,
        provider: 'email'
      });
      
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      
      await perfectAuthAPI.syncUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: userCredential.user.displayName || '',
        emailVerified: userCredential.user.emailVerified,
        provider: 'google'
      });
      
    } catch (error: any) {
      setError('Google authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vata via-pitta to-kapha flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4">
            <img src="/nadi-icon.svg" alt="Nadi Pariksha" className="w-full h-full" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Nadi Pariksha</h1>
          <p className="text-white/80">Ayurvedic Pulse Analysis System</p>
        </div>
        
        <Card className="backdrop-blur-sm bg-white/90">
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <Input
                  type="text"
                  placeholder="Full Name (Optional)"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              )}
              
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
              
              {isSignUp && (
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              )}
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 
                  (isSignUp ? 'Creating Account...' : 'Signing In...') : 
                  (isSignUp ? 'Create Account' : 'Sign In')
                }
              </Button>
            </form>
            
            <div className="mt-4">
              <Button onClick={handleGoogleAuth} variant="outline" className="w-full">
                Continue with Google
              </Button>
            </div>
            
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
              
              <p className="text-xs text-gray-500">
                🔒 Firebase + Database Sync
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};