// import logo from '../assets/logo.svg';

import { Link, useNavigate } from 'react-router-dom';
import InputComponent from './InputComponent';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import { logoutUser } from '../utils/api';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [smSearch, setSmSearch] = useState(false);
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
    const fetchTodos = async () => {
      try {
        console.log(search);
      } catch (error) {
        console.log(error);
      }
    };
    const timer = setTimeout(() => {
      fetchTodos();
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <nav className="flex justify-between items-center px-5 sm:px-10 py-3 bg-gray-200 transition-all duration-300">
      {smSearch ? (
        <div className="flex items-center mx-auto p-[2px]">
          <button
            className="flex items-center justify-center rounded-full p-1 bg-white"
            onClick={() => setSmSearch(false)}
          >
            <FaArrowLeft />
          </button>
          <form className="flex items-center justify-center mx-auto px-1 rounded-full focus:outline-gray-300">
            <InputComponent
              className="px-3 text-lg rounded-full focus:outline-gray-300"
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>
      ) : (
        <>
          <Link
            to="/todos"
            className="flex items-center gap-2 bg-gray-600 text-white px-2 rounded"
          >
            <h1 className="text-lg sm:text-2xl font-bold">Pesto-todo</h1>
          </Link>
          <form className="hidden md:flex items-center px-1 rounded-full focus:outline-gray-300">
            <InputComponent
              className="px-3 text-lg rounded-full focus:outline-gray-300"
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <div className="flex">
            {loading && (
              <div className="text-gray-600 font-bold text-xl">loading...</div>
            )}

            {error && <p className="text-red-600 font-bold text-xl">{error}</p>}

            {user && !loading && !error && (
              <div className="flex items-center gap-5">
                <button
                  className="flex items-center justify-center md:hidden rounded-full p-1 bg-white"
                  onClick={() => setSmSearch(true)}
                >
                  <FaSearch className="text-gray-600 text-xl" />
                </button>
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
        </>
      )}
    </nav>
  );
};

export default Header;
