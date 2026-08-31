import ReactDOM from 'react-dom/client';
import './custom.scss';
import './index.css';
import App from './App';
import SJAApp from './SJAApp';
import { QContextProvider } from './store/question-context';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
const basename = window.location.pathname.startsWith('/StudyMachine5000') ? '/StudyMachine5000' : '/';
const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/SJA", element: <SJAApp /> }
], { basename });

root.render(
  <QContextProvider>
    <RouterProvider router={router} />
  </QContextProvider>
);