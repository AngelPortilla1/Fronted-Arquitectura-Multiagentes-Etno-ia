import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import P4_ColadeRevisiones from './pages/P4_ColadeRevisiones';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirigimos temporalmente la raíz a la pantalla que estamos desarrollando */}
        <Route path='/' element={<Navigate to="/revisiones" replace />} />
        
        {/* Ruta oficial según la Tarea F1.3 */}
        <Route path='/revisiones' element={<P4_ColadeRevisiones />} />
      </Routes>
    </BrowserRouter>
  );
}