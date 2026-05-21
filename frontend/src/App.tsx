import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import SuppliersPage from '@/pages/SuppliersPage';
import ProductsPage from '@/pages/ProductsPage';
import MovementsPage from '@/pages/MovementsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/movements" element={<MovementsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
