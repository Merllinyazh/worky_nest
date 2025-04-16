import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import Backlogs from './pages/Backlogs';
import KanbanBoard from './pages/KanbanBoard';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/project" element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          } />
          <Route path="/backlogs/:projectId" element={
            <ProtectedRoute>
              <Backlogs />
            </ProtectedRoute>
          } />
          
          <Route path="/kanban" element={
            <ProtectedRoute>
              <KanbanBoard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;