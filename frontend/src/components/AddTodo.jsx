import { useState } from 'react';

const AddTodo = () => {
  const [todo, setTodo] = useState({
    title: '',
    description: '',
    status: '',
  });

  return (
    <>
      <div className="flex flex-col w-1/3 p-5">
        <h1 className="text-lg md:text-xl font-bold whitespace-nowrap">
          Create a new todo
        </h1>
        <form className="flex flex-col gap-3 mt-5">
          <input
            type="text"
            placeholder="Enter your title"
            className="px-3 py-1 border border-gray-400 rounded"
            required
          />
          <input
            type="text"
            placeholder="Enter your description"
            className="px-3 py-1 border border-gray-400 rounded"
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
            <option value="all">All</option>
            <option value="todo">To Do</option>
            <option value="inProgress">In progress</option>
            <option value="done">Done</option>
          </select>
          <button className="bg-gray-800 text-white p-3 rounded">Create</button>
        </form>
      </div>
    </>
  );
};
export default AddTodo;
