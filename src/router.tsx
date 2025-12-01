import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "./Layouts/MainLayout";
import ServicesPage from "./pages/ServicesPage";
import ProfessionalsPage from "./pages/ProfessionalsPage";
import ClientsPage from "./pages/ClientsPage";
import CalendarPage from "./pages/CalendarPage";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/calendar" />} />

          <Route path="/services" element={<ServicesPage />} />
          <Route path="/professionals" element={<ProfessionalsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

