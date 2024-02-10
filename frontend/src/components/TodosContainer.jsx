import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTodo from './AddTodo';
import { createTodo, getTodos } from '../utils/api';
import TodosList from './TodosList';

const TodosContainer = () => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState(todos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddTodo = async (e, todo) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await createTodo(todo);
      if (res?.success) {
        const todo = res?.todo;
        setTodos((prevTodos) => [todo, ...prevTodos]);
        setError('');
        setLoading(false);
      } else {
        setError(res?.message || 'Something went wrong');
        setLoading(false);
      }
    } catch (error) {
      setError(error?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {};

    if (!userInfo) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchTodos = async () => {
      setError('');
      setLoading(true);
      try {
        const res = await getTodos();
        if (res?.success) {
          setTodos(res?.todos);
          setLoading(false);
        } else {
          setError(res?.message || 'Something went wrong');
          setLoading(false);
        }
      } catch (error) {
        setError(error?.message || 'Something went wrong');
        setLoading(false);
      }
    };
    fetchTodos();
  }, [setTodos, setFilteredTodos]);

  useEffect(() => {
    setFilteredTodos(todos);
  }, [todos]);

  return (
    <div className="flex justify-center items-center overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-center items-start mx-auto rounded w-[95%] md:w-[70%] bg-gray-200 shadow-inner shadow-gray-400">
        <AddTodo handleAddTodo={handleAddTodo} loading={loading} />

        <div className="flex flex-col w-full sm:w-2/3 p-5">
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex justify-between gap-2 my-4">
            <h1 className="text-lg md:text-xl font-bold sticky top-2 pb-2">
              Your Todos
            </h1>
            <div className="flex border border-gray-400 rounded">
              <select
                name="filter"
                id="filter"
                className="w-full px-3"
                onChange={(e) => {
                  const filter = e.target.value;
                  if (filter === 'all') {
                    setFilteredTodos(todos);
                  } else {
                    setFilteredTodos(
                      todos.filter((todo) => todo.status === filter)
                    );
                  }
                }}
              >
                <option value="all">All</option>
                <option value="todo">Todo</option>
                <option value="inProgress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          <div className="overflow-auto h-full max-h-[80vh] pb-10">
            {todos && (
              <TodosList
                todos={filteredTodos}
                loading={loading}
                setTodos={setTodos}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TodosContainer;
