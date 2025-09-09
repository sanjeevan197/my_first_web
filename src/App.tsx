import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotificationSystem } from './components/NotificationSystem';
import { LoadingScreen } from './components/LoadingScreen';
import { Navbar } from './components/Navbar';
import { LoginFirst } from './pages/LoginFirst';
import { UserHome } from './pages/UserHome';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import { SuperAdminPanel } from './pages/SuperAdminPanel';
import { DeveloperPage } from './pages/DeveloperPage';
import { Analysis } from './pages/Analysis';
import { Results } from './components/Results';
import { isAdmin, isSuperAdmin, getUserRole } from './utils/auth';
import { useNotifications } from './hooks/useNotifications';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { notifications, removeNotification, success, error, warning } = useNotifications();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginFirst />;
  }

  const userIsAdmin = isAdmin(user.email);
  const userIsSuperAdmin = isSuperAdmin(user.email);
  const userRole = getUserRole(user.email);
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar user={user} isAdmin={userIsAdmin} isSuperAdmin={userIsSuperAdmin} />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<UserHome user={user} notifications={{ success, error, warning }} />} />
              <Route path="/profile" element={<Profile user={user} notifications={{ success, error, warning }} />} />
              <Route path="/analysis" element={<Analysis user={user} notifications={{ success, error, warning }} />} />
              <Route path="/results" element={<Results user={user} notifications={{ success, error, warning }} />} />
              <Route path="/developer" element={<DeveloperPage />} />
              
              {/* Admin Routes */}
              {userIsAdmin && (
                <Route path="/admin" element={<AdminDashboard notifications={{ success, error, warning }} />} />
              )}
              
              {/* Super Admin Only Routes */}
              {userIsSuperAdmin && (
                <Route path="/superadmin" element={<SuperAdminPanel notifications={{ success, error, warning }} />} />
              )}
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          
          <NotificationSystem 
            notifications={notifications} 
            onRemove={removeNotification} 
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;