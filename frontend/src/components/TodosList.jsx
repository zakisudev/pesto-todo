const TodosList = () => {
  return (
    <>
      <div className="flex flex-col w-2/3 p-5">
        <h1 className="text-lg md:text-xl font-bold">Your todos</h1>
        <ul className="flex flex-col gap-3 mt-5">
          <li className="flex justify-between items-center p-3 bg-gray-300 rounded">
            <span>Todo 1</span>
            <div className="flex gap-3">
              <button className="bg-green-500 text-white p-2 rounded">
                Edit
              </button>
              <button className="bg-red-500 text-white p-2 rounded">
                Delete
              </button>
            </div>
          </li>
          <li className="flex justify-between items-center p-3 bg-gray-300 rounded">
            <span>Todo 2</span>
            <div className="flex gap-3">
              <button className="bg-green-500 text-white p-2 rounded">
                Edit
              </button>
              <button className="bg-red-500 text-white p-2 rounded">
                Delete
              </button>
            </div>
          </li>
          <li className="flex justify-between items-center p-3 bg-gray-300 rounded">
            <span>Todo 3</span>
            <div className="flex gap-3">
              <button className="bg-green-500 text-white p-2 rounded">
                Edit
              </button>
              <button className="bg-red-500 text-white p-2 rounded">
                Delete
              </button>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default TodosList;
