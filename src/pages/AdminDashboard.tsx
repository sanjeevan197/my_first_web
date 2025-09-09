import React, { useState, useEffect } from 'react';
import { nadiAPI } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, Database, Settings, Shield, Eye } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
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

  const viewUserDetails = async (user: any) => {
    try {
      const response = await nadiAPI.getUserDetails(user.id);
      setUserDetails(response.data);
      setSelectedUser(user);
    } catch (error) {
      console.error('Failed to get user details:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Shield className="mr-3 text-red-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Complete system access and user management</p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <Users className="mx-auto text-blue-600" size={32} />
              <CardTitle className="text-center">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-center">{users.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Database className="mx-auto text-green-600" size={32} />
              <CardTitle className="text-center">Database</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-green-600 font-medium">Connected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Settings className="mx-auto text-orange-600" size={32} />
              <CardTitle className="text-center">System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-green-600 font-medium">Online</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="mx-auto text-red-600" size={32} />
              <CardTitle className="text-center">Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-green-600 font-medium">Active</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* All Users List */}
          <Card>
            <CardHeader>
              <CardTitle>All Registered Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => viewUserDetails(user)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{user.display_name || 'No Name'}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">
                          ID: {user.id.substring(0, 20)}...
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Details */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedUser ? `User Details: ${selectedUser.email}` : 'Select a User'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userDetails ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded">
                    <h3 className="font-semibold mb-2">Personal Information</h3>
                    <p><strong>Full ID:</strong> {userDetails.user?.id}</p>
                    <p><strong>Email:</strong> {userDetails.user?.email}</p>
                    <p><strong>Display Name:</strong> {userDetails.user?.display_name || 'Not provided'}</p>
                    <p><strong>Created:</strong> {new Date(userDetails.user?.created_at).toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded">
                    <h3 className="font-semibold mb-2">Analysis History ({userDetails.reports?.length || 0})</h3>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {userDetails.reports?.map((report: any) => (
                        <div key={report.id} className="text-sm p-2 bg-white rounded">
                          <p><strong>Date:</strong> {report.date}</p>
                          <p>
                            <span className="text-vata">V:{report.vata}%</span> | 
                            <span className="text-pitta"> P:{report.pitta}%</span> | 
                            <span className="text-kapha"> K:{report.kapha}%</span>
                          </p>
                          <p className="text-gray-600">{report.status}</p>
                        </div>
                      )) || <p className="text-gray-500">No analysis reports</p>}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Click on a user to view their complete details
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};