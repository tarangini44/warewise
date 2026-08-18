import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

import Inventory from "./pages/Inventory";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import Simulator from "./pages/Simulator";
import Orders from "./pages/Orders";
import Allocation from "./pages/Allocation";
import PickingPacking from "./pages/PickingPacking";
import Fulfillment from "./pages/Fulfillment";
import Exceptions from "./pages/Exceptions";
import Settings from "./pages/Settings";

import WareWiseLayout from "./components/WareWiseLayout";

function ProtectedRoute({ children }) {
  const isLoggedIn =
    localStorage.getItem("warewise_logged_in") === "true";

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* WareWise application pages */}
        <Route
          element={
            <ProtectedRoute>
              <WareWiseLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/allocation" element={<Allocation />} />

          <Route
            path="/picking-packing"
            element={<PickingPacking />}
          />

          <Route
            path="/fulfillment"
            element={<Fulfillment />}
          />

          <Route
            path="/exceptions"
            element={<Exceptions />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />
        </Route>

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;