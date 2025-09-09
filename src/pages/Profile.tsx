import React, { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { User as FirebaseUser } from 'firebase/auth';
import { nadiAPI } from '../services/api';
import { useRealTime } from '../hooks/useRealTime';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { User, Edit, Save, X, Wifi, WifiOff } from 'lucide-react';

interface ProfileProps {
  user: FirebaseUser;
  notifications?: {
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
  };
}

export const Profile: React.FC<ProfileProps> = ({ user, notifications }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { isConnected, realTimeData } = useRealTime(user);

  useEffect(() => {
    // Load profile data from API
    const loadProfile = async () => {
      try {
        const response = await nadiAPI.getProfile(user.uid);
        if (response.data.profile) {
          const profile = response.data.profile;
          setPhone(profile.phone || '');
          setAge(profile.age || '');
          setAddress(profile.address || '');
          if (profile.display_name) {
            setDisplayName(profile.display_name);
          }
        }
      } catch (error) {
        // Fallback to localStorage
        const savedProfile = localStorage.getItem(`profile_${user.uid}`);
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          setPhone(profile.phone || '');
          setAge(profile.age || '');
          setAddress(profile.address || '');
        }
      }
    };
    
    loadProfile();
  }, [user.uid]);

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    
    // Validation
    if (!displayName.trim()) {
      setMessage('❌ Name is required');
      setLoading(false);
      notifications?.error('Name is required');
      return;
    }
    
    if (phone && !/^[\d\s\+\-\(\)]+$/.test(phone)) {
      setMessage('❌ Invalid phone number format');
      setLoading(false);
      notifications?.error('Invalid phone number format');
      return;
    }
    
    if (age && (parseInt(age) < 1 || parseInt(age) > 120)) {
      setMessage('❌ Age must be between 1 and 120');
      setLoading(false);
      notifications?.error('Age must be between 1 and 120');
      return;
    }

    try {
      // Update Firebase display name
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }

      // Save to database
      const response = await nadiAPI.updateProfile(user.uid, {
        displayName: displayName.trim(),
        phone: phone.trim(),
        age: age ? parseInt(age) : null,
        address: address.trim()
      });

      // Save additional profile data to localStorage
      const profileData = {
        displayName: displayName.trim(),
        phone: phone.trim(),
        age: age.trim(),
        address: address.trim(),
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(`profile_${user.uid}`, JSON.stringify(profileData));

      setMessage('✅ Profile updated successfully');
      notifications?.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update profile';
      setMessage(`❌ ${errorMessage}`);
      notifications?.error(`Failed to update profile: ${errorMessage}`);
      console.error('Profile update error:', error);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setDisplayName(user.displayName || '');
    setIsEditing(false);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <User className="mr-3 text-blue-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            </div>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <div className="flex items-center text-green-600">
                  <Wifi size={16} className="mr-1" />
                  <span className="text-sm">Live</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <WifiOff size={16} className="mr-1" />
                  <span className="text-sm">Offline</span>
                </div>
              )}
              <span className="text-sm text-gray-500">
                {realTimeData.userCount} users online
              </span>
            </div>
          </div>
          <p className="text-gray-600">Manage your account information • Real-time updates enabled</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Profile Information</CardTitle>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} size="sm">
                    <Edit size={16} className="mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" disabled={loading}>
                      <Save size={16} className="mr-2" />
                      {loading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button onClick={handleCancel} size="sm" variant="outline">
                      <X size={16} />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name *</label>
                  {isEditing ? (
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Enter your full name"
                      className={!displayName.trim() ? 'border-red-300' : ''}
                      required
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">{displayName || 'Not provided'}</p>
                  )}
                  {isEditing && !displayName.trim() && (
                    <p className="text-xs text-red-600 mt-1">Name is required</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <p className="p-2 bg-gray-100 rounded text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  {isEditing ? (
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 234 567 8900"
                      className={phone && !/^[\d\s\+\-\(\)]+$/.test(phone) ? 'border-red-300' : ''}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">{phone || 'Not provided'}</p>
                  )}
                  {isEditing && phone && !/^[\d\s\+\-\(\)]+$/.test(phone) && (
                    <p className="text-xs text-red-600 mt-1">Invalid phone format</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Age</label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Enter your age"
                      min="1"
                      max="120"
                      className={age && (parseInt(age) < 1 || parseInt(age) > 120) ? 'border-red-300' : ''}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">{age || 'Not provided'}</p>
                  )}
                  {isEditing && age && (parseInt(age) < 1 || parseInt(age) > 120) && (
                    <p className="text-xs text-red-600 mt-1">Age must be between 1 and 120</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  {isEditing ? (
                    <textarea
                      className="w-full p-2 border rounded-md resize-none"
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded min-h-[80px]">{address || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">User ID</label>
                  <p className="p-2 bg-gray-100 rounded text-xs font-mono break-all">{user.uid}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Account Created</label>
                  <p className="p-2 bg-gray-50 rounded">
                    {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleString() : 'Unknown'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Last Sign In</label>
                  <p className="p-2 bg-gray-50 rounded">
                    {user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleString() : 'Unknown'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email Verified</label>
                  <p className={`p-2 rounded ${user.emailVerified ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
                    {user.emailVerified ? '✅ Verified' : '⚠️ Not Verified'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Sign In Method</label>
                  <p className="p-2 bg-gray-50 rounded">
                    {user.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email/Password'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Profile */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Health Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-vata/10 rounded-lg">
                <h3 className="font-semibold text-vata mb-2">Vata Constitution</h3>
                <p className="text-sm text-gray-600">Movement & Nervous System</p>
              </div>
              <div className="text-center p-4 bg-pitta/10 rounded-lg">
                <h3 className="font-semibold text-pitta mb-2">Pitta Constitution</h3>
                <p className="text-sm text-gray-600">Digestion & Metabolism</p>
              </div>
              <div className="text-center p-4 bg-kapha/10 rounded-lg">
                <h3 className="font-semibold text-kapha mb-2">Kapha Constitution</h3>
                <p className="text-sm text-gray-600">Structure & Immunity</p>
              </div>
            </div>
            <p className="text-center text-gray-500 mt-4">
              Complete your Nadi Pariksha analysis to see your dosha balance
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};