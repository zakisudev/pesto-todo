import { useState } from 'react';
import { FaCheck, FaEdit } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';
import { deleteTodo, updateTodo } from '../utils/api';
import spinner from '../assets/spinner.svg';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Modal from 'react-modal';

const TodosList = ({ todos, loading, setTodos }) => {
  Modal.setAppElement('#root');
  const [status, setStatus] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [error, setError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const handleEditSelect = (todo) => {
    setEditingTodo(todo);
    setIsStatusOpen(true);
  };
  const handleDelete = (id) => {
    setModalIsOpen(true);
    setEditingTodo({ _id: id });
  };

  const handleStatusChange = async () => {
    setEditLoading(true);
    setError('');

    try {
      const res = await updateTodo(editingTodo._id, { status });
      if (res?.success) {
        const deletedTodo = res?.todo;
        setTodos((prevTodos) => {
          const newTodos = prevTodos.map((t) => {
            if (t?._id === deletedTodo?._id) {
              return deletedTodo;
            }
            return t;
          });
          return newTodos;
        });
        toast.success('Todo updated successfully');
        setError('');
        setEditLoading(false);
        setIsStatusOpen(false);
      } else {
        setError(res?.message || 'Something went wrong');
        setEditLoading(false);
      }
    } catch (error) {
      setError(error?.message || 'Something went wrong');
      setEditLoading(false);
    }
  };

  const handleDeleteTodo = async () => {
    setError('');
    setEditLoading(true);
    try {
      const res = await deleteTodo(editingTodo._id);
      if (res?.success) {
        setTodos((prevTodos) =>
          prevTodos.filter((todo) => todo?._id !== editingTodo._id)
        );
        setError('');
        setEditLoading(false);
        setModalIsOpen(false);
      } else {
        setError(res?.message || 'Something went wrong');
        setEditLoading(false);
      }
    } catch (error) {
      setError(error?.message || 'Something went wrong');
      setEditLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {modalIsOpen && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          className="flex h-full w-full items-center justify-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          contentLabel="Delete Confirmation Modal"
        >
          <div className="flex w-96 flex-col items-center justify-center rounded-md bg-white px-10 py-5 shadow-lg">
            <h1 className="text-center text-2xl font-bold text-gray-700">
              The todo will be deleted, Are you sure?
            </h1>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleDeleteTodo}
                className="flex-1 rounded-md bg-red-500 px-2 py-1 font-bold text-white transition-all hover:bg-red-700"
              >
                {editLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setModalIsOpen(false)}
                className="flex-1 rounded-md bg-gray-500 px-2 py-1 font-bold text-white transition-all hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      <ul className="flex flex-col gap-3 overflow-auto pb-20">
        {todos && todos?.length === 0 && (
          <p className="text-center">No todos found</p>
        )}

        {loading && <p className="text-center">Loading...</p>}

        {error && <p className="text-red-500">{error}</p>}

        {todos &&
          todos?.map((todo) => (
            <li
              key={todo?._id}
              className="flex flex-col sm:flex-row justify-between items-center p-3 border border-gray-400 rounded bg-white shadow-md"
            >
              <div>
                <h1 className="text-lg font-semibold">
                  {todo?.title}{' '}
                  <span>
                    {todo?.status === 'todo'
                      ? '🔴'
                      : todo?.status === 'inProgress'
                      ? '🟡'
                      : '🟢'}
                  </span>{' '}
                </h1>
                <p className="text-sm">{todo?.description}</p>
                <p className="text-gray-400 text-sm">
                  <span>Last updated: </span>
                  {todo?.updatedAt
                    ? format(new Date(todo?.updatedAt), 'do MMM yyyy HH:MM a')
                    : format(new Date(todo?.createdAt), 'do MMM yyyy hh:mm a')}
                </p>
              </div>

              <div className="flex gap-2">
                {isStatusOpen && editingTodo._id === todo._id ? (
                  <>
                    <select
                      value={status || todo?.status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="outline-none p-1 rounded bg-gray-300"
                    >
                      <option value="" disabled>
                        Status
                      </option>
                      <option value="todo">Todo</option>
                      <option value="inProgress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                    <button
                      disabled={editLoading}
                      onClick={handleStatusChange}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      {editLoading ? (
                        <img
                          src={spinner}
                          alt="loading"
                          className="w-4 h-4 bg-transparent"
                        />
                      ) : (
                        <FaCheck />
                      )}
                    </button>
                    <button
                      onClick={() => setIsStatusOpen(false)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      <FaXmark />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      disabled={editLoading}
                      onClick={() => handleEditSelect(todo)}
                      className="px-2 bg-blue-500 text-white rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(todo._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      <MdDelete />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default TodosList;
