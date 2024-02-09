import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
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
        <Route index element={<Todos />} />
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
