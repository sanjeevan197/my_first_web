import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/services/firebase';
import { nadiAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
      
      // Get and log JWT token
      const token = await userCredential.user.getIdToken();
      console.log('🎉 Authentication Success!');
      console.log('🔐 Firebase JWT Token:', token);
      console.log('👤 User ID:', userCredential.user.uid);
      
      // Save user to database
      await nadiAPI.saveUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: userCredential.user.displayName || ''
      });
      console.log('💾 User saved to MySQL database');
      
    } catch (error) {
      console.error('Auth error:', error);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      
      // Get and log JWT token
      const token = await userCredential.user.getIdToken();
      console.log('🎉 Google Authentication Success!');
      console.log('🔐 Firebase JWT Token:', token);
      console.log('👤 User ID:', userCredential.user.uid);
      
      // Save user to database
      await nadiAPI.saveUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: userCredential.user.displayName || ''
      });
      console.log('💾 User saved to MySQL database');
      
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-vata via-pitta to-kapha p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {isLogin ? 'Login' : 'Sign Up'} to Nadi Pariksha
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
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
              {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
            </Button>
          </form>
          
          <div className="mt-4">
            <Button onClick={handleGoogleSignIn} variant="outline" className="w-full">
              Sign in with Google
            </Button>
          </div>
          
          <div className="mt-4 space-y-2">
            <p className="text-center">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
            
            <div className="text-center">
              <a href="/guest" className="text-sm text-gray-600 hover:text-gray-800 underline">
                🔍 Guest Access - View All User Data
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};