import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useState } from 'react';
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validateUsername,
} from '../utils/validators';
import { registerUser } from '../utils/api';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!validateEmail(userData.email)) {
      setError('Invalid email');
      setLoading(false);
      return;
    }
    if (!validatePassword(userData.password)) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    if (!validateConfirmPassword(userData.password, userData.confirmPassword)) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (!validateUsername(userData.username)) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await registerUser({
        username: userData?.username,
        email: userData?.email,
        password: userData?.password,
      });

      if (res?.success) {
        navigate('/login', { replace: true });
        setLoading(false);
        toast.success('Account created successfully, Please login');
        return;
      } else {
        setLoading(false);
        setError(res?.message);
        return;
      }
    } catch (error) {
      setError('An error occurred');
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center w-full h-screen bg-gray-200">
        <form
          onSubmit={handleRegister}
          className="flex flex-col justify-center items-center gap-3 w-full sm:w-[400px] bg-white p-5 rounded-lg shadow-lg py-10"
        >
          <h1 className="font-bold text-2xl text-center mb-5 uppercase">
            Register
          </h1>
          <div className="flex gap-1 flex-col w-[80%]">
            <label htmlFor="username" className="font-semibold uppercase">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="px-2 py-1 text-xl border border-gray-400 outline-none focus:outline-none focus:border-blue-500 rounded"
              required
              onChange={(e) =>
                setUserData({ ...userData, username: e.target.value })
              }
            />
          </div>
          <div className="flex gap-1 flex-col w-[80%]">
            <label htmlFor="email" className="font-semibold uppercase">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="px-2 py-1 text-xl border border-gray-400 outline-none focus:outline-none focus:border-blue-500 rounded"
              required
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
            />
          </div>
          <div className="flex gap-1 flex-col w-[80%]">
            <label htmlFor="password" className="font-semibold uppercase">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="px-2 py-1 text-xl border border-gray-400 outline-none focus:outline-none focus:border-blue-500 rounded"
              required
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
          </div>
          <div className="flex gap-1 flex-col w-[80%]">
            <label
              htmlFor="confirmPassword"
              className="font-semibold uppercase"
            >
              Confirm password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="px-2 py-1 text-xl border border-gray-400 outline-none focus:outline-none focus:border-blue-500 rounded"
              required
              onChange={(e) =>
                setUserData({ ...userData, confirmPassword: e.target.value })
              }
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-semibold text-center">
              {error}
            </p>
          )}

          <Button
            type="submit"
            title="Register"
            className={`px-2 py-2 rounded bg-blue-600 w-[80%] mt-2 text-white font-bold uppercase text-xl hover:bg-blue-700 transition-all duration-300 ${
              loading ||
              !validateEmail(userData?.email) ||
              !validatePassword(userData?.password) ||
              !validateConfirmPassword(
                userData?.password,
                userData?.confirmPassword
              ) ||
              (!validateUsername(userData?.username) &&
                'bg-gray-400 cursor-not-allowed')
            }`}
            disabled={loading}
            loading={loading}
          />
          <div className="flex">
            <p className="text-gray-600">Already have an account?</p>
            <Link
              to="/login"
              className="text-blue-600 ml-1 font-semibold hover:underline"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
