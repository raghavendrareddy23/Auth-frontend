import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TailSpin } from 'react-loader-spinner';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true); 
      const response = await fetch('https://auth-backend-syz9.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        const user = { username }; 
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user)); 
        setLoading(false); 
        toast.success('Login successful'); 
        navigate('/home');
      } else {
        console.error('invalid credentials');
        setLoading(false); 
        toast.error('invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setLoading(false); 
      toast.error('An error occurred. Please try again later.');
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
            <h1 className='text-3xl pb-3 font-bold text-teal-600 text-center'>Login</h1>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleLogin}
          >
            {loading ? (
              <TailSpin type="ThreeDots" color="#FFF" height={20} width={20} />
            ) : (
              'Log In'
            )}
          </button>
          <Link to="/" className="text-blue-500 hover:text-blue-700">
            Don't have an account? Sign up
          </Link>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
