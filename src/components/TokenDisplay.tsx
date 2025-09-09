import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';

interface TokenDisplayProps {
  user: User;
}

export const TokenDisplay: React.FC<TokenDisplayProps> = ({ user }) => {
  const [token, setToken] = useState<string>('');
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  const refreshToken = async () => {
    if (user) {
      const newToken = await user.getIdToken(true);
      setToken(newToken);
      
      // Decode JWT payload (without verification - for display only)
      try {
        const payload = JSON.parse(atob(newToken.split('.')[1]));
        setTokenInfo(payload);
        console.log('🔄 Token Refreshed:', newToken);
        console.log('📋 Token Payload:', payload);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  };

  useEffect(() => {
    refreshToken();
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          JWT Token Management
          <Button onClick={refreshToken} size="sm">
            Refresh Token
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="font-medium mb-2">Firebase JWT Token:</p>
            <div className="bg-gray-100 p-3 rounded text-xs font-mono break-all max-h-32 overflow-y-auto">
              {token || 'Loading...'}
            </div>
          </div>
          
          {tokenInfo && (
            <div>
              <p className="font-medium mb-2">Token Information:</p>
              <div className="bg-blue-50 p-3 rounded text-sm">
                <p><strong>User ID:</strong> {tokenInfo.user_id}</p>
                <p><strong>Email:</strong> {tokenInfo.email}</p>
                <p><strong>Issued At:</strong> {new Date(tokenInfo.iat * 1000).toLocaleString()}</p>
                <p><strong>Expires At:</strong> {new Date(tokenInfo.exp * 1000).toLocaleString()}</p>
                <p><strong>Issuer:</strong> {tokenInfo.iss}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};