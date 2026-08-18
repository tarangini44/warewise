import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  ClipboardList,
  Truck,
  AlertTriangle,
  BarChart3,
  Settings,
} from "lucide-react";

function Sidebar({ sidebarOpen, activePage, setActivePage }) {
  const navigation = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Inventory", path: "/inventory", icon: Package },
    { name: "Orders", path: "/orders", icon: ShoppingCart },
    { name: "Allocation", path: "/allocation", icon: Boxes },
    { name: "Picking & Packing", path: "/picking", icon: ClipboardList },
    { name: "Fulfillment", path: "/fulfillment", icon: Truck },
    { name: "Exceptions", path: "/exceptions", icon: AlertTriangle },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Simulator", path: "/simulator", icon: Boxes },
  ];

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <div className="brand">
        <div className="brand-icon">
          <Boxes size={24} />
        </div>

        {sidebarOpen && (
          <div className="brand-text">
            <h1>WareWise</h1>
            <span>Smart Warehouse</span>
          </div>
        )}
      </div>

      <div className="warehouse-status">
        <span className="status-dot"></span>

        {sidebarOpen && (
          <div>
            <strong>Warehouse Online</strong>
            <span>Operations active</span>
          </div>
        )}
      </div>

      <nav className="navigation">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.name;

          return (
           <NavLink
             key={item.name}
             to={item.path}
             className={`nav-item ${isActive ? "active" : ""}`}
             onClick={() => setActivePage(item.name)}
            >
             <Icon size={19} />

             {sidebarOpen && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item">
          <Settings size={19} />

          {sidebarOpen && <span>Settings</span>}
        </button>

        <div className="user-card">
          <div className="avatar">A</div>

          {sidebarOpen && (
            <div className="user-info">
              <strong>Warehouse Admin</strong>
              <span>Administrator</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;