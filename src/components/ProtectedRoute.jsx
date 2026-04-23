import { Navigate, useLocation } from 'react-router-dom';
import { useSimba } from '../context/SimbaContext';

export default function ProtectedRoute({ children, requireRole }) {
  const { currentUser } = useSimba();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (requireRole && currentUser.role !== requireRole) {
    return <Navigate to="/account" replace />;
  }

  return children;
}
