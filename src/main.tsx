// Fix: Ensure window.fetch has both getter and setter to prevent "Cannot set property fetch of #<Window> which has only a getter"
try {
  let _currentFetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    get: () => _currentFetch,
    set: (newFetch) => {
      _currentFetch = newFetch;
    },
    configurable: true,
    enumerable: true,
  });
} catch {
  // ignore
}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
