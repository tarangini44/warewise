import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Boxes,
  Package,
  Bot,
  BarChart3,
  Bell,
  ShoppingCart,
  ClipboardList,
  Truck,
  AlertTriangle,
  Settings,
  Home,
  ArrowLeft,
} from "lucide-react";

function WareWiseLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("warewise_logged_in");
    navigate("/login", { replace: true });
  };

  const navigation = [
    { name: "Inventory", path: "/inventory", icon: Package },
    { name: "Simulator", path: "/simulator", icon: Bot },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Alerts", path: "/alerts", icon: Bell },
    { name: "Orders", path: "/orders", icon: ShoppingCart },
    { name: "Allocation", path: "/allocation", icon: Boxes },
    {
      name: "Picking & Packing",
      path: "/picking-packing",
      icon: ClipboardList,
    },
    { name: "Fulfillment", path: "/fulfillment", icon: Truck },
    {
      name: "Exceptions",
      path: "/exceptions",
      icon: AlertTriangle,
    },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="warewise-app">
      <div className="warewise-background"></div>

      <header className="warewise-header">

        <div
          className="warewise-brand"
          onClick={() => navigate("/")}
        >
          <div className="warewise-logo">
            <Boxes size={24} />
          </div>

          <div>
            <h1>WareWise</h1>
            <span>Smart Warehouse</span>
          </div>
        </div>

        <div className="warehouse-status">
          <span className="status-dot"></span>
          Warehouse Online
        </div>

        <div className="header-actions">

          <button
            className="home-button"
            onClick={() => navigate("/")}
          >
            <Home size={18} />
            Dashboard
          </button>

          <button
            className="home-button"
            onClick={handleLogout}
          >
            <ArrowLeft size={18} />
            Logout
          </button>

        </div>

      </header>

      <div className="warewise-body">

        <aside className="warewise-sidebar">

          <div className="sidebar-title">
            <span>WAREHOUSE MODULES</span>
          </div>

          <nav>
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `warewise-nav-item ${
                      isActive ? "active" : ""
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          <button
            className="back-dashboard"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

        </aside>

        <main className="warewise-main">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default WareWiseLayout;