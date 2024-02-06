import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TailSpin } from 'react-loader-spinner';

const Home = () => {
  const navigate = useNavigate();
  const [warningTimeoutID, setWarningTimeoutID] = useState(undefined);
  const [logoutTimeoutID, setLogoutTimeoutID] = useState(undefined);
  // eslint-disable-next-line no-unused-vars
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoginSuccessToast, setShowLoginSuccessToast] = useState(false);

  useEffect(() => {
    const events = ["click", "mousemove", "mousedown", "keydown"];

    const eventHandler = () => {
      setLastActivity(Date.now());
      if (logoutTimeoutID) {
        clearTimeout(logoutTimeoutID);
        toast.dismiss(); 
      }
      clearTimeout(warningTimeoutID);
      setWarningTimeoutID(setTimeout(callTimeoutFunc, 180000)); 
    };

    const callTimeoutFunc = () => {
      toast.warn('You have been inactive for some time and are now being logged out.');
      setLogoutTimeoutID(setTimeout(() => {
        navigate('/login');
      }, 240000)); 
    };

    events.forEach((event) => {
      window.addEventListener(event, eventHandler);
    });

    const checkTokenExpiration = () => {
      const tokenExpirationTime = localStorage.getItem('tokenExpiration');
      if (tokenExpirationTime) {
        const currentTime = Date.now();
        if (currentTime >= parseInt(tokenExpirationTime)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          toast.error('Your session has expired. Please log in again.');
        }
      }
    };

    checkTokenExpiration();

    const tokenExpirationInterval = setInterval(checkTokenExpiration, 180000);

    const storedUser = localStorage.getItem('user'); // Moved inside useEffect

    if (storedUser && showLoginSuccessToast) {
      toast.success('Login successful.');
      setShowLoginSuccessToast(true);
    }

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user.username) {
          setUserName(user.username);
        }
      } catch (error) {
        console.error('Error parsing user information:', error);
      }
    }

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, eventHandler);
      });
      clearTimeout(warningTimeoutID);
      clearTimeout(logoutTimeoutID);
      clearInterval(tokenExpirationInterval);
    };
  }, [logoutTimeoutID, navigate, warningTimeoutID, showLoginSuccessToast]);

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logout successful.');
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className='text-3xl pb-3 font-bold text-purple-600 text-center uppercase'>Welcome, {userName || 'User'}!</h1>
      <p>Stay active to avoid automatic logout.</p>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {loading ? (
          <TailSpin type="ThreeDots" color="#FFF" height={20} width={20} />
        ) : (
          'Logout'
        )}
      </button>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default Home;
