import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout';
import P0_Home from './pages/P0_Home';
import P4_ColadeRevisiones from './pages/P4_ColadeRevisiones';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas envueltas por el Layout (Header y StatusBar) */}
        <Route element={<Layout />}>
          
          {/* Tarea F1.2: Selector de Rol */}
          <Route path="/" element={<P0_Home />} />
          
          {/* Tarea F2.4 / F3.2: La cola de revisiones que ya construimos */}
          <Route path="/revisiones" element={<P4_ColadeRevisiones />} />
          
          {/* Aquí iremos agregando P1, P2, P3, etc. */}
          <Route path="/registrar-relato" element={<div className="p-8 text-xl">Pantalla P1 (En construcción...)</div>} />
          <Route path="/auditoria" element={<div className="p-8 text-xl">Pantalla P7 (En construcción...)</div>} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}