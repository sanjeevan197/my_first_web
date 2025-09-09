import React, { useState, useEffect } from 'react';
import { nadiAPI } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface User {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
  total_reports: number;
  last_analysis: string;
}

export const GuestLogin: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [guestEmail, setGuestEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await nadiAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleGuestLogin = async () => {
    try {
      const response = await nadiAPI.guestLogin(guestEmail);
      setSelectedUser(response.data.user);
      
      // Get detailed user data
      const detailsResponse = await nadiAPI.getUserDetails(response.data.user.id);
      setUserDetails(detailsResponse.data);
      
      console.log('Guest login successful:', response.data);
    } catch (error) {
      alert('User not found or login failed');
    }
  };

  const selectUser = async (user: User) => {
    try {
      const detailsResponse = await nadiAPI.getUserDetails(user.id);
      setUserDetails(detailsResponse.data);
      setSelectedUser(user);
    } catch (error) {
      console.error('Failed to get user details:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Guest Access - All User Data</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Guest Login */}
          <Card>
            <CardHeader>
              <CardTitle>Guest Login by Email</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter user email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                />
                <Button onClick={handleGuestLogin}>Login</Button>
              </div>
            </CardContent>
          </Card>

          {/* All Users List */}
          <Card>
            <CardHeader>
              <CardTitle>All Registered Users ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                    onClick={() => selectUser(user)}
                  >
                    <p className="font-medium">{user.display_name || 'No Name'}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      Reports: {user.total_reports} | Joined: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected User Details */}
        {userDetails && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>User Details: {userDetails.user?.display_name || userDetails.user?.email}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">User Information</h3>
                  <p><strong>ID:</strong> {userDetails.user?.id}</p>
                  <p><strong>Email:</strong> {userDetails.user?.email}</p>
                  <p><strong>Name:</strong> {userDetails.user?.display_name || 'Not provided'}</p>
                  <p><strong>Joined:</strong> {new Date(userDetails.user?.created_at).toLocaleString()}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Analysis History ({userDetails.reports?.length || 0})</h3>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {userDetails.reports?.map((report: any) => (
                      <div key={report.id} className="p-2 bg-gray-50 rounded">
                        <p className="text-sm"><strong>Date:</strong> {report.date}</p>
                        <p className="text-sm">
                          <span className="text-vata">V:{report.vata}%</span> | 
                          <span className="text-pitta"> P:{report.pitta}%</span> | 
                          <span className="text-kapha"> K:{report.kapha}%</span>
                        </p>
                        <p className="text-xs text-gray-600">{report.status}</p>
                      </div>
                    )) || <p className="text-gray-500">No analysis reports yet</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};