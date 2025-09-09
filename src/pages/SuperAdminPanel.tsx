import React, { useState, useEffect } from 'react';
import { nadiAPI } from '../services/api';
import { addAdmin, removeAdmin, getAllAdmins } from '../utils/auth';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Crown, UserPlus, UserMinus, Shield, Users } from 'lucide-react';

export const SuperAdminPanel: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [admins, setAdmins] = useState<string[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAllUsers();
    setAdmins(getAllAdmins());
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await nadiAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleAddAdmin = () => {
    if (!newAdminEmail) {
      setMessage('Please enter an email address');
      return;
    }

    const userExists = users.find(u => u.email.toLowerCase() === newAdminEmail.toLowerCase());
    if (!userExists) {
      setMessage('User must be registered first');
      return;
    }

    if (addAdmin(newAdminEmail)) {
      setAdmins(getAllAdmins());
      setNewAdminEmail('');
      setMessage(`✅ ${newAdminEmail} added as admin`);
    } else {
      setMessage('User is already an admin');
    }
  };

  const handleRemoveAdmin = (email: string) => {
    if (removeAdmin(email)) {
      setAdmins(getAllAdmins());
      setMessage(`❌ ${email} removed from admin`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Crown className="mr-3 text-yellow-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Super Admin Panel</h1>
          </div>
          <p className="text-gray-600">Manage administrators and system access</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Add New Admin */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="mr-2 text-green-600" />
                Add New Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter user email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                />
                <Button onClick={handleAddAdmin} className="w-full">
                  <UserPlus size={16} className="mr-2" />
                  Make Admin
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Admins */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 text-blue-600" />
                Current Admins ({admins.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <div className="p-2 bg-yellow-50 rounded border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-yellow-800">
                      <Crown size={16} className="inline mr-1" />
                      sanjeev.arjava@gmail.com
                    </span>
                    <span className="text-xs text-yellow-600">SUPER ADMIN</span>
                  </div>
                </div>
                
                {admins.map((email) => (
                  <div key={email} className="p-2 bg-gray-50 rounded border">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{email}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveAdmin(email)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <UserMinus size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {admins.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No additional admins</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 text-purple-600" />
              All Registered Users ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {users.map((user) => {
                const isCurrentAdmin = admins.includes(user.email.toLowerCase());
                const isSuperAdmin = user.email.toLowerCase() === 'sanjeev.arjava@gmail.com';
                
                return (
                  <div
                    key={user.id}
                    className={`p-3 border rounded ${
                      isSuperAdmin ? 'bg-yellow-50 border-yellow-200' :
                      isCurrentAdmin ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {isSuperAdmin && <Crown size={14} className="inline mr-1 text-yellow-600" />}
                          {isCurrentAdmin && !isSuperAdmin && <Shield size={14} className="inline mr-1 text-blue-600" />}
                          {user.display_name || 'No Name'}
                        </p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {!isSuperAdmin && (
                        <Button
                          size="sm"
                          variant={isCurrentAdmin ? "outline" : "default"}
                          onClick={() => {
                            if (isCurrentAdmin) {
                              handleRemoveAdmin(user.email);
                            } else {
                              setNewAdminEmail(user.email);
                              handleAddAdmin();
                            }
                          }}
                          className={isCurrentAdmin ? "text-red-600" : "text-green-600"}
                        >
                          {isCurrentAdmin ? <UserMinus size={14} /> : <UserPlus size={14} />}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};