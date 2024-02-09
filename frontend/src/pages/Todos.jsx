import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TodosList from '../components/TodosContainer';

const Todos = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {};

    if (!userInfo) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);
  return (
    <>
      <div className="flex flex-col">
        <Header />
        <main className="w-full mt-10">
          <TodosList />
        </main>
      </div>
    </>
  );
};

export default Todos;
