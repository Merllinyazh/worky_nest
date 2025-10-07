import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Backlogs from "./pages/Backlogs";
import KanbanBoard from "./pages/KanbanBoard";
import ProjectDetails from "./pages/ProjectDetails";
import Teams from "./pages/Teams";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Default route */}
        <Route index element={<Navigate to="home" replace />} />

        <Route
          path="home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/backlogs/:projectId"
          element={
            <ProtectedRoute>
              <Backlogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kanban/:sprintId"
          element={
            <ProtectedRoute>
              <KanbanBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="project/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="teams"
          element={
            <ProtectedRoute>
              <Teams />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
