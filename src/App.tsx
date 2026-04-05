import { RouterProvider } from 'react-router-dom';
import { AppProvider } from './app/provider';
import { createAppRouter } from './app/router';
import './App.css'

// El router se crea UNA SOLA VEZ fuera del componente.
// Si se crea dentro, React lo recrea en cada re-render (ej. al cambiar
// estado de una mutación) desmontando toda la app y causando pantalla en blanco.
const router = createAppRouter();

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App
