import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Todos from './pages/Todos';
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="" element={<ProtectedRoute />}>
        <Route path="todos" element={<Todos />} />
      </Route>
      <Route path="*" element={<ToastContainer />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
