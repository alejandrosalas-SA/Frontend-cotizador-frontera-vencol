import { RouterProvider } from 'react-router-dom';
import { AppProvider } from './app/provider';
import { createAppRouter } from './app/router';
import './App.css'

function App() {
  const router = createAppRouter();

  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App
