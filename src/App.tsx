import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Landing } from "@/pages/Landing";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Copilot } from "@/pages/Copilot";
import { Workflow } from "@/pages/Workflow";
import { Inventory } from "@/pages/Inventory";
import { Analytics } from "@/pages/Analytics";
import { Settings } from "@/pages/Settings";
import { Employees } from "@/pages/Employees";
import { Documents } from "@/pages/Documents";
import { Notifications } from "@/pages/Notifications";
import { PromptLibrary } from "@/pages/PromptLibrary";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/copilot" element={<Copilot />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/workflow" element={<Workflow />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/prompts" element={<PromptLibrary />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
