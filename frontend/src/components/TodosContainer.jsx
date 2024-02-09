import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTodo from './AddTodo';
import TodosList from './TodosList';

const TodosContainer = () => {
  const [todos, setTodos] = useState([]);

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    <div className="flex justify-center items-center h-full">
      <div className="flex justify-center items-center mx-auto w-[95%] md:w-[70%] bg-gray-200">
        <AddTodo />
        <TodosList />
      </div>
    </div>
  );
};
export default TodosContainer;
