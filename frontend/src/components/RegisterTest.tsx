import { useState, useEffect, createContext, useContext } from 'react';

// TypeScript interfaces
interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

interface RegisterResponse {
  message?: string;
  user?: User;
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  error?: string;
}

interface LoginResponse {
  access_token?: string;
  token_type?: string;
  error?: string;
}

interface UsersResponse {
  total_users: number;
  users: User[];
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://127.0.0.1:8000/auth';

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchCurrentUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch current user info
  const fetchCurrentUser = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE}/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token is invalid
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data: LoginResponse = await response.json();
        if (data.access_token) {
          setToken(data.access_token);
          localStorage.setItem('token', data.access_token);
          await fetchCurrentUser(data.access_token);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // Register function
  const register = async (email: string, username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password })
      });

      if (response.ok) {
        const data: RegisterResponse = await response.json();
        if (data.access_token && data.user) {
          setToken(data.access_token);
          setUser(data.user);
          localStorage.setItem('token', data.access_token);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin || false,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Main Auth Component
function AuthTest() {
  const { user, login, register, logout, isAuthenticated, isAdmin, loading } = useAuth();
  
  // Form states
  const [registerData, setRegisterData] = useState({
    email: '',
    username: '',
    password: ''
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // UI states
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  // Users data (for admin)
  const [users, setUsers] = useState<User[]>([]);
  const [userCount, setUserCount] = useState<number | null>(null);
  
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'profile' | 'users'>('login');

  const API_BASE = 'http://127.0.0.1:8000/auth';

  // Fetch users (authenticated API call)
  const fetchUsers = async () => {
    if (!isAuthenticated) return;
    
    setUsersLoading(true);
    try {
      const response = await fetch(`${API_BASE}/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data: UsersResponse = await response.json();
        setUsers(data.users);
        setUserCount(data.total_users);
      } else if (response.status === 401) {
        logout(); // Token expired
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  // Load users when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError(null);
    
    const success = await register(registerData.email, registerData.username, registerData.password);
    
    if (success) {
      setRegisterData({ email: '', username: '', password: '' });
      setActiveTab('profile');
    } else {
      setRegisterError('Registration failed. Please try again.');
    }
    
    setRegisterLoading(false);
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    
    const success = await login(loginData.email, loginData.password);
    
    if (success) {
      setLoginData({ email: '', password: '' });
      setActiveTab('profile');
    } else {
      setLoginError('Invalid email or password.');
    }
    
    setLoginLoading(false);
  };

  // Delete user (admin only)
  const deleteUser = async (username: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/users/${username}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        fetchUsers(); // Refresh the list
      } else if (response.status === 401) {
        logout(); // Token expired
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Delete user error:', error);
      alert('Failed to delete user');
    }
  };

  // Make user admin
  const makeUserAdmin = async (username: string) => {
    if (!window.confirm(`Make "${username}" an admin?`)) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/users/${username}/make-admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        fetchUsers(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
      }
    } catch (error) {
      console.error('Make admin error:', error);
      alert('Failed to make user admin');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">🏝️ Survivor Fantasy League</h1>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'login' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'register' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Login</h2>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                required
              />
              
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                required
              />
              
              <button 
                type="submit"
                disabled={loginLoading}
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            {loginError && (
              <div className="p-3 bg-red-100 text-red-800 rounded-lg">
                {loginError}
              </div>
            )}
          </div>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Create Account</h2>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                required
              />
              
              <input
                type="text"
                placeholder="Username"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={registerData.username}
                onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                required
              />
              
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                required
              />
              
              <button 
                type="submit"
                disabled={registerLoading}
                className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {registerLoading ? 'Creating Account...' : 'Register'}
              </button>
            </form>
            
            {registerError && (
              <div className="p-3 bg-red-100 text-red-800 rounded-lg">
                {registerError}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Authenticated User Interface
  return (
    <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">🏝️ Survivor Fantasy League</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            Welcome, <strong>{user?.username}</strong>
            {isAdmin && <span className="ml-2 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Admin</span>}
          </div>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* User Count Display */}
      {userCount !== null && (
        <div className="mb-6 p-3 bg-blue-100 rounded-lg text-center">
          <strong className="text-blue-800">Total Users: {userCount}</strong>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'profile' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'users' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('users')}
        >
          All Users
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Your Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Account Information</h3>
              <div className="space-y-2">
                <div><strong>Username:</strong> {user?.username}</div>
                <div><strong>Email:</strong> {user?.email}</div>
                <div><strong>User ID:</strong> {user?.id}</div>
                <div><strong>Account Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    user?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user?.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div><strong>Role:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    user?.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user?.is_admin ? 'Administrator' : 'User'}
                  </span>
                </div>
                <div><strong>Member Since:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                  Update Profile
                </button>
                <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                  View My Leagues
                </button>
                <button className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">
                  Create New League
                </button>
                <button 
                  onClick={() => setActiveTab('users')}
                  className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
                >
                  Browse All Users
                </button>
              </div>
            </div>
          </div>

          {/* JWT Token Info (for development) */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-lg mb-2">🔐 JWT Token Info (Development)</h3>
            <div className="text-sm text-gray-600">
              <div><strong>Token:</strong> <code className="bg-gray-100 px-1 rounded">{localStorage.getItem('token')?.substring(0, 50)}...</code></div>
              <div className="mt-2">Your token is automatically included in all API requests.</div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">All Users</h2>
            <div className="space-x-2">
              <button
                onClick={fetchUsers}
                disabled={usersLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {usersLoading ? 'Loading...' : 'Refresh'}
              </button>
              {isAdmin && (
                <button
                  onClick={() => {
                    if (window.confirm('⚠️ Delete all users except yourself?')) {
                      // Implement delete all users
                    }
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  ⚠️ Delete All
                </button>
              )}
            </div>
          </div>
          
          {usersLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading users...</div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">No users found.</div>
            </div>
          ) : (
            <div className="grid gap-4">
              {users.map(userItem => (
                <div key={userItem.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="font-semibold text-lg">{userItem.username}</div>
                      <div className="text-gray-600">{userItem.email}</div>
                      {userItem.is_admin && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                          Admin
                        </span>
                      )}
                      {!userItem.is_active && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                          Inactive
                        </span>
                      )}
                      {userItem.id === user?.id && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      ID: {userItem.id} • Created: {new Date(userItem.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Admin Actions */}
                  {isAdmin && userItem.id !== user?.id && (
                    <div className="flex space-x-2 ml-4">
                      {!userItem.is_admin && (
                        <button
                          onClick={() => makeUserAdmin(userItem.username)}
                          className="bg-purple-500 text-white px-2 py-1 rounded text-sm hover:bg-purple-600"
                        >
                          Make Admin
                        </button>
                      )}
                      <button
                        onClick={() => deleteUser(userItem.username)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Main App Component with Auth Provider
export default function AuthTestApp() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <AuthTest />
      </div>
    </AuthProvider>
  );
}