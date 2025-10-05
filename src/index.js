import ReactDOM from 'react-dom/client';
import './custom.scss';
import './index.css';
import App from './App';
import { QContextProvider } from './store/question-context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QContextProvider>
    <App />
  </QContextProvider>
);
