import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BoardProvider } from './context/BoardContext';
import { LoginPage } from './pages/LoginPage';
import { BoardPage } from './pages/BoardPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BoardProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/board"
              element={
                <ProtectedRoute>
                  <BoardPage />
                </ProtectedRoute>
              }
            />
            {/* Redirect root to board (which will redirect to login if not auth) */}
            <Route path="/" element={<Navigate to="/board" replace />} />
          </Routes>
        </BoardProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
