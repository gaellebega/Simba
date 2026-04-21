import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { SimbaProvider, useSimba } from './context/SimbaContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ToastContainer from './components/ToastContainer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AuthPage from './pages/AuthPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AccountPage from './pages/AccountPage';
import ProtectedRoute from './components/ProtectedRoute';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function LoadingScreen({ message }) {
  return (
    <div className="simba-shell simba-center-panel">
      <div className="simba-panel simba-loading-card">
        <div className="simba-spinner" />
        <p>{message}</p>
      </div>
    </div>
  );
}

function AppContent() {
  const { loading, error } = useSimba();

  if (loading) {
    return <LoadingScreen message="Preparing the Simba Supermarket platform..." />;
  }

  if (error) {
    return <LoadingScreen message={error} />;
  }

  return (
    <>
      <ScrollToTop />
      <Header />
      <CartDrawer />
      <ToastContainer />
      <main className="simba-shell">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={(
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            )}
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/account"
            element={(
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/admin"
            element={(
              <ProtectedRoute requireRole="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            )}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <SimbaProvider>
            <AppContent />
          </SimbaProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
