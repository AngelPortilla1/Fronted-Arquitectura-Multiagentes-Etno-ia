import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import P0_Home from './pages/P0_Home';
import P1_RegistrarRelato from './pages/P1_RegistrarRelato';
import P2_ModeloMental from './pages/P2_ModeloMental'; // <--- Importamos P2
import P4_ColadeRevisiones from './pages/P4_ColadeRevisiones';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<P0_Home />} />
          <Route path="/registrar-relato" element={<P1_RegistrarRelato />} />
          
          {/* F2.2: Pantalla del Modelo Mental y Grafo */}
          <Route path="/modelo-mental" element={<P2_ModeloMental />} />
          
          <Route path="/revisiones" element={<P4_ColadeRevisiones />} />
          <Route path="/auditoria" element={<div className="p-8 text-xl">Pantalla P7 (En construcción...)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}