// import logo from '../assets/logo.svg';

import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../utils/api';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const user =
    localStorage.getItem('userInfo') &&
    JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await logoutUser();
      if (res?.success) {
        toast.success("You've been logged out successfully!");
        navigate('/login');
        return setLoading(false);
      } else {
        console.log(res?.message);
        setLoading(false);
        setError(res?.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError('Something went wrong');
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <nav className="flex justify-between items-center px-5 sm:px-10 py-3 bg-gray-200 transition-all duration-300">
      <Link
        to="/"
        className="flex items-center gap-2 bg-gray-600 text-white px-2 rounded"
      >
        <h1 className="text-lg sm:text-2xl font-bold">Pesto-todo</h1>
      </Link>

      <div className="flex">
        {loading && (
          <div className="text-gray-600 font-bold text-xl">loading...</div>
        )}

        {error && <p className="text-red-600 font-bold text-xl">{error}</p>}

        {user && !loading && !error && (
          <div className="flex items-center gap-5">
            <span className="text-gray-600 font-bold text-xl">
              {user?.username?.charAt(0)?.toUpperCase() +
                user?.username?.slice(1)}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
