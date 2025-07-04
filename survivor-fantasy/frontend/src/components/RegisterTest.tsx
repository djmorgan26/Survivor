import { useState, useEffect } from 'react';

// TypeScript interfaces
interface RegisterResponse {
  message?: string;
  user_id?: number;
  username?: string;
  email?: string;
  error?: string;
}

interface LoginResponse {
  message?: string;
  user_id?: number;
  username?: string;
  email?: string;
  access_token?: string;
  token_type?: string;
  error?: string;
}

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

interface UsersResponse {
  total_users: number;
  users: User[];
}

function RegisterTest() {
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

  // Response states
  const [registerResult, setRegisterResult] = useState<RegisterResponse | null>(null);
  const [loginResult, setLoginResult] = useState<LoginResponse | null>(null);
  
  // Loading states
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  
  // Users data
  const [users, setUsers] = useState<User[]>([]);
  const [userCount, setUserCount] = useState<number | null>(null);
  
  // UI state
  const [activeTab, setActiveTab] = useState<'register' | 'login' | 'users'>('register');

  const API_BASE = 'http://127.0.0.1:8000/auth';

  // Fetch users from API
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await fetch(`${API_BASE}/users`);
      if (response.ok) {
        const data: UsersResponse = await response.json();
        setUsers(data.users);
        setUserCount(data.total_users);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle user registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterResult(null);
    
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setRegisterResult(data);
        setRegisterData({ email: '', username: '', password: '' });
        fetchUsers(); // Refresh user list
      } else {
        setRegisterResult({ error: data.detail || 'Registration failed' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setRegisterResult({ error: errorMessage });
    } finally {
      setRegisterLoading(false);
    }
  };

  // Handle user login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginResult(null);
    
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setLoginResult(data);
        setLoginData({ email: '', password: '' });
      } else {
        setLoginResult({ error: data.detail || 'Login failed' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setLoginResult({ error: errorMessage });
    } finally {
      setLoginLoading(false);
    }
  };

  // Delete user by username
  const deleteUser = async (username: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/users/${username}`, {
        method: 'DELETE'
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to delete user: ${errorMessage}`);
    }
  };

  // Delete all users (dangerous!)
  const deleteAllUsers = async () => {
    if (!window.confirm('⚠️ Are you ABSOLUTELY sure you want to delete ALL users? This cannot be undone!')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/users/all?confirm=true`, {
        method: 'DELETE'
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to delete all users: ${errorMessage}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8">🏝️ Survivor Fantasy League - Auth Testing</h1>
      
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
            activeTab === 'register' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('register')}
        >
          Register
        </button>
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
            activeTab === 'users' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('users')}
        >
          All Users
        </button>
      </div>

      {/* Registration Tab */}
      {activeTab === 'register' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Create New Account</h2>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={registerData.username}
                onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                required
              />
            </div>
            
            <button 
              type="submit"
              disabled={registerLoading}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {registerLoading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
          
          {/* Registration Result */}
          {registerResult && (
            <div className={`p-4 rounded-lg ${
              registerResult.error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {registerResult.error ? (
                <div>
                  <strong>❌ Error:</strong> {registerResult.error}
                </div>
              ) : (
                <div>
                  <strong>✅ Success!</strong>
                  <div className="mt-2 text-sm">
                    <div><strong>User ID:</strong> {registerResult.user_id}</div>
                    <div><strong>Username:</strong> {registerResult.username}</div>
                    <div><strong>Email:</strong> {registerResult.email}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Login Tab */}
      {activeTab === 'login' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Login to Account</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                required
              />
            </div>
            
            <button 
              type="submit"
              disabled={loginLoading}
              className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loginLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          {/* Login Result */}
          {loginResult && (
            <div className={`p-4 rounded-lg ${
              loginResult.error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {loginResult.error ? (
                <div>
                  <strong>❌ Error:</strong> {loginResult.error}
                </div>
              ) : (
                <div>
                  <strong>✅ Login Successful!</strong>
                  <div className="mt-2 text-sm">
                    <div><strong>Username:</strong> {loginResult.username}</div>
                    <div><strong>Email:</strong> {loginResult.email}</div>
                    <div><strong>Token:</strong> {loginResult.access_token}</div>
                  </div>
                </div>
              )}
            </div>
          )}
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
              <button
                onClick={deleteAllUsers}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                ⚠️ Delete All
              </button>
            </div>
          </div>
          
          {usersLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading users...</div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">No users found. Create some accounts to see them here!</div>
            </div>
          ) : (
            <div className="grid gap-4">
              {users.map(user => (
                <div key={user.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="font-semibold text-lg">{user.username}</div>
                      <div className="text-gray-600">{user.email}</div>
                      {user.is_admin && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                          Admin
                        </span>
                      )}
                      {!user.is_active && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      ID: {user.id} • Created: {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteUser(user.username)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 ml-4"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RegisterTest;