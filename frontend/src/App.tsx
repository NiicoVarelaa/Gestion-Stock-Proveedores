import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import Dashboard from '@/pages/Dashboard';
import SuppliersPage from '@/pages/SuppliersPage';
import ProductsPage from '@/pages/ProductsPage';
import MovementsPage from '@/pages/MovementsPage';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/movements" element={<MovementsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
