import { useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

const AddTodo = ({ handleAddTodo }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [todo, setTodo] = useState({
    title: '',
    description: '',
    status: '',
  });

  return (
    <div className="flex flex-col w-full sm:w-1/3 p-5 sticky top-0">
      <div className="flex justify-between gap-2">
        <h1 className="text-lg md:text-xl font-bold whitespace-nowrap">
          Create a new todo
        </h1>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 bg-gray-500 text-white rounded transition-all duration-200 hover:bg-gray-700"
        >
          {collapsed ? <FaChevronDown /> : <FaChevronUp />}
        </button>
      </div>
      {!collapsed && (
        <form
          onSubmit={(e) => {
            handleAddTodo(e, todo);
            setTodo({
              title: '',
              description: '',
              status: '',
            });
          }}
          className="flex flex-col gap-3 mt-5 transition-all duration-300"
        >
          <input
            type="text"
            placeholder="Enter your title"
            className="px-3 py-1 border border-gray-400 rounded"
            value={todo?.title}
            onChange={(e) => {
              setTodo({
                ...todo,
                title: e.target.value,
              });
            }}
            required
          />
          <textarea
            type="text"
            placeholder="Enter your description"
            className="px-3 py-1 border border-gray-400 rounded max-h-40 resize-none overflow-y-auto"
            value={todo?.description}
            onChange={(e) => {
              setTodo({
                ...todo,
                description: e.target.value,
              });
            }}
            required
          />
          <select
            name="status"
            id="status"
            className="p-2 border-gray-500 border rounded"
            value={todo?.status}
            onChange={(e) => {
              setTodo({
                ...todo,
                status: e.target.value,
              });
            }}
            required
          >
            <option value="" disabled>
              Select a status
            </option>
            <option value="todo">To Do</option>
            <option value="inProgress">In progress</option>
            <option value="done">Done</option>
          </select>

          <button
            disabled={!todo.title || !todo.description || !todo.status}
            type="submit"
            className={`${
              !todo.title || !todo.description || !todo.status
                ? 'cursor-not-allowed bg-gray-400 text-gray-500'
                : 'cursor-pointer hover:bg-gray-700 bg-gray-500 text-white'
            }   p-3 rounded transition-all duration-200 uppercase font-semibold`}
          >
            Create
          </button>
        </form>
      )}
    </div>
  );
};
export default AddTodo;
