import { Routes, Route } from "react-router-dom";
import App from "./App";
import AdminApp from "./modules/admin";

export default function MainRoutes() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/*" element={<App />} />
    </Routes>
  );
}
