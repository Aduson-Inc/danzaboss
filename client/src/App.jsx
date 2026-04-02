import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TeamProvider } from './context/TeamContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateTeamPage from './pages/CreateTeamPage';
import JoinTeamPage from './pages/JoinTeamPage';
import TeamPage from './pages/TeamPage';

function App() {
  return (
    <AuthProvider>
      <TeamProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/teams/create" element={<CreateTeamPage />} />
            <Route path="/teams/join" element={<JoinTeamPage />} />
            <Route path="/teams/:id" element={<TeamPage />} />
          </Route>
        </Routes>
      </TeamProvider>
    </AuthProvider>
  );
}

export default App;
