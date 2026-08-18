import { useEffect, useState } from "react";
import axios from "axios";
import {
  Package,
  Bot,
  BarChart3,
  Bell,
  ShoppingCart,
  Boxes,
  ClipboardList,
  Truck,
  AlertTriangle,
  Settings,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API_URL = "http://127.0.0.1:8000";

function Dashboard() {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [exceptions, setExceptions] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const modules = [
    {
      name: "Inventory",
      icon: Package,
      route: "/inventory",
      description: "Stock & inventory monitoring",
    },
    {
      name: "Simulator",
      icon: Bot,
      route: "/simulator",
      description: "What-if warehouse simulation",
    },
    {
      name: "Analytics",
      icon: BarChart3,
      route: "/analytics",
      description: "Warehouse performance insights",
    },
    {
      name: "Alerts",
      icon: Bell,
      route: "/alerts",
      description: "Critical warehouse alerts",
    },
    {
      name: "Orders",
      icon: ShoppingCart,
      route: "/orders",
      description: "Manage customer orders",
    },
    {
      name: "Allocation",
      icon: Boxes,
      route: "/allocation",
      description: "Optimize stock allocation",
    },
    {
      name: "Picking & Packing",
      icon: ClipboardList,
      route: "/picking-packing",
      description: "Manage fulfillment operations",
    },
    {
      name: "Fulfillment",
      icon: Truck,
      route: "/fulfillment",
      description: "Track order fulfillment",
    },
    {
      name: "Exceptions",
      icon: AlertTriangle,
      route: "/exceptions",
      description: "Resolve warehouse issues",
    },
    {
      name: "Settings",
      icon: Settings,
      route: "/settings",
      description: "System configuration",
    },
  ];

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        analyticsResponse,
        alertsResponse,
        exceptionsResponse,
      ] = await Promise.all([
        axios.get(`${API_URL}/api/analytics/`),
        axios.get(`${API_URL}/api/alerts/`),
        axios.get(`${API_URL}/api/exceptions/`),
      ]);

      setAnalytics(analyticsResponse.data);
      setAlerts(alertsResponse.data);
      setExceptions(exceptionsResponse.data);
    } catch (err) {
      console.error("Dashboard API error:", err);
      setError("Unable to load warehouse dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const totalProducts =
    analytics?.inventory?.total_products ?? 0;

  const totalOrders =
    analytics?.orders?.total_orders ?? 0;

  const fulfillmentRate =
    analytics?.orders?.fulfillment_rate ?? 0;

  const lowStock =
    analytics?.inventory?.low_stock_products ?? 0;

  const totalAlerts =
    alerts?.total_alerts ?? 0;

  const totalExceptions =
    exceptions?.total_exceptions ?? 0;

  return (
    <div className="dashboard-home">
      <div className="dashboard-overlay"></div>

      <div className="dashboard-content">

        {/* HEADER */}

        <div className="dashboard-header">

          <div className="dashboard-brand">

            <div className="dashboard-logo">
              <Boxes size={30} />
            </div>

            <div>
              <h1>WareWise</h1>
              <p>Smart Warehouse Management</p>
            </div>

          </div>

          <div className="warehouse-online">
            <span></span>
            Warehouse Online
          </div>

        </div>

        {/* TITLE */}

        <div className="dashboard-title">

          <p>WAREHOUSE COMMAND CENTER</p>

          <h2>Welcome to WareWise</h2>

          <span>
            Monitor warehouse operations and manage every
            stage of fulfillment.
          </span>

        </div>

        {/* DASHBOARD OVERVIEW */}

        <div className="dashboard-overview">

          <div className="overview-header">

            <div>
              <h2>Warehouse Overview</h2>

              <p>
                Live operational summary from the warehouse backend.
              </p>
            </div>

            <button
              className="dashboard-refresh"
              onClick={loadDashboard}
              disabled={loading}
            >
              <RefreshCw
                size={16}
                className={loading ? "spin" : ""}
              />

              Refresh
            </button>

          </div>

          {loading ? (

            <div className="dashboard-loading">
              <RefreshCw size={24} className="spin" />
              <span>Loading warehouse data...</span>
            </div>

          ) : error ? (

            <div className="dashboard-error">

              <AlertTriangle size={22} />

              <div>
                <strong>Dashboard connection failed</strong>

                <p>{error}</p>
              </div>

              <button
                className="dashboard-refresh"
                onClick={loadDashboard}
              >
                Retry
              </button>

            </div>

          ) : (

            <div className="dashboard-stats">

              {/* PRODUCTS */}

              <div className="dashboard-stat-card">

                <div className="dashboard-stat-icon">
                  <Package size={22} />
                </div>

                <div>
                  <span>Total Products</span>
                  <strong>{totalProducts}</strong>
                </div>

              </div>

              {/* ORDERS */}

              <div className="dashboard-stat-card">

                <div className="dashboard-stat-icon">
                  <ShoppingCart size={22} />
                </div>

                <div>
                  <span>Total Orders</span>
                  <strong>{totalOrders}</strong>
                </div>

              </div>

              {/* FULFILLMENT */}

              <div className="dashboard-stat-card">

                <div className="dashboard-stat-icon">
                  <TrendingUp size={22} />
                </div>

                <div>
                  <span>Fulfillment Rate</span>
                  <strong>{fulfillmentRate}%</strong>
                </div>

              </div>

              {/* LOW STOCK */}

              <div className="dashboard-stat-card">

                <div className="dashboard-stat-icon">
                  <Package size={22} />
                </div>

                <div>
                  <span>Low Stock</span>
                  <strong>{lowStock}</strong>
                </div>

              </div>

              {/* ALERTS */}

              <div className="dashboard-stat-card">

                <div className="dashboard-stat-icon">
                  <Bell size={22} />
                </div>

                <div>
                  <span>Active Alerts</span>
                  <strong>{totalAlerts}</strong>
                </div>

              </div>

              {/* EXCEPTIONS */}

              <div className="dashboard-stat-card">

                <div className="dashboard-stat-icon">
                  <AlertTriangle size={22} />
                </div>

                <div>
                  <span>Exceptions</span>
                  <strong>{totalExceptions}</strong>
                </div>

              </div>

            </div>

          )}

        </div>

        {/* MODULES */}

        <div className="warehouse-modules-title">
          <p>WAREHOUSE MODULES</p>
        </div>

        <div className="module-grid">

          {modules.map((module) => {

            const Icon = module.icon;

            return (
              <button
                key={module.name}
                className="module-card"
                onClick={() => navigate(module.route)}
              >

                <div className="module-icon">
                  <Icon size={26} />
                </div>

                <div className="module-info">

                  <h3>{module.name}</h3>

                  <p>{module.description}</p>

                </div>

                <span className="module-arrow">
                  →
                </span>

              </button>
            );

          })}

        </div>

        {/* FOOTER */}

        <div className="dashboard-footer">

          <span>WAREWISE</span>

          <span>
            Smart Warehouse Operations Platform
          </span>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;