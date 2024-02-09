import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TodosContainer from '../components/TodosContainer';
import { ToastContainer } from 'react-toastify';

const Todos = () => {
  const navigate = useNavigate();
  const userInfo =
    localStorage.getItem('userInfo') &&
    JSON.parse(localStorage.getItem('userInfo')).success;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login', { replace: true });
    }
  }, [navigate, userInfo]);

  return (
    <div className="flex flex-col max-h-screen">
      <Header />
      <main className="w-full my-10 overflow-hidden">
        <TodosContainer />
      </main>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Todos;
