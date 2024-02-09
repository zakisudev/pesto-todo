import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { loginUser } from '../utils/api';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    user: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginUser(userData);
      if (res?.success) {
        setLoading(false);
        navigate('/', { replace: true });
        toast.success('Logged in successfully');
        return;
      } else {
        setLoading(false);
        setError(res?.message);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;
    if (userInfo) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <div className="flex flex-col justify-center items-center w-full h-screen bg-gray-200">
        <form
          onSubmit={handleLogin}
          className="flex flex-col justify-center items-center gap-3 w-full sm:w-[400px] bg-white p-5 rounded-lg shadow-lg py-10"
        >
          <h1 className="font-bold text-2xl text-center mb-5 uppercase">
            Login
          </h1>
          <div className="flex gap-1 flex-col w-[80%]">
            <input
              type="text"
              id="username"
              name="username"
              className="px-2 py-1 text-xl border border-gray-400 outline-none focus:outline-none focus:border-blue-500 rounded"
              placeholder="Email or Username"
              required
              onChange={(e) =>
                setUserData({ ...userData, user: e.target.value })
              }
            />
          </div>

          <div className="flex gap-1 flex-col w-[80%]">
            <input
              type="password"
              id="password"
              name="password"
              className="px-2 py-1 text-xl border border-gray-400 outline-none focus:outline-none focus:border-blue-500 rounded"
              placeholder="Password"
              required
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
          </div>
          <div className="flex justify-between w-[80%]">
            <Link
              to="/forgot-password"
              className="text-blue-500 font-semibold ml-auto"
            >
              Forgot Password?
            </Link>
          </div>

          {error && (
            <p className="text-red-500 text-sm font-semibold text-center">
              {error}
            </p>
          )}

          <Button
            title="Login"
            className="px-2 py-2 rounded bg-blue-600 w-[80%] mt-2 text-white font-bold uppercase text-xl hover:bg-blue-700 transition-all duration-300"
            disabled={loading}
            loading={loading}
          />
          <div className="flex">
            <p>Don't have an account?</p>
            <Link to="/register" className="text-blue-500 font-semibold ml-1">
              Register
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
