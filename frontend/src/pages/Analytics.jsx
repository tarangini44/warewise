import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart3,
  TrendingUp,
  Package,
  ShoppingCart,
  Truck,
  AlertTriangle,
} from "lucide-react";
import ModuleHeader from "../components/ModuleHeader";
import API_URL from "../config";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Analytics API URL:", API_URL);

      const response = await axios.get(
        `${API_URL}/api/analytics/`
      );

      console.log("Analytics response:", response.data);

      setAnalytics(response.data);
    } catch (err) {
      console.error("Analytics API error:", err);

      if (err.response) {
        console.error("Server response:", err.response.data);
        console.error("Status:", err.response.status);
      }

      setError("Unable to load warehouse analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="module-page">
        <ModuleHeader
          eyebrow="WAREHOUSE ANALYTICS"
          title="Analytics"
          description="Monitor warehouse performance and operational trends."
        />

        <div className="module-panel">
          <h2>Loading analytics...</h2>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="module-page">
        <ModuleHeader
          eyebrow="WAREHOUSE ANALYTICS"
          title="Analytics"
          description="Monitor warehouse performance and operational trends."
        />

        <div className="module-panel">
          <div className="dashboard-error">
            <AlertTriangle size={22} />

            <div>
              <strong>Dashboard connection failed</strong>
              <p>{error || "No analytics data available."}</p>
            </div>
          </div>

          <button
            className="module-action"
            onClick={loadAnalytics}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const inventory = analytics.inventory || {};
  const orders = analytics.orders || {};

  const totalProducts = inventory.total_products || 0;
  const totalStock = inventory.total_stock || 0;
  const reservedStock = inventory.reserved_stock || 0;
  const availableStock = inventory.available_stock || 0;
  const lowStockProducts = inventory.low_stock_products || 0;
  const outOfStockProducts = inventory.out_of_stock_products || 0;

  const totalOrders = orders.total_orders || 0;
  const completedOrders = orders.completed_orders || 0;
  const fulfillmentRate = orders.fulfillment_rate || 0;

  const byStatus = orders.by_status || {};
  const byPriority = orders.by_priority || {};

  return (
    <div className="module-page">
      <ModuleHeader
        eyebrow="WAREHOUSE ANALYTICS"
        title="Analytics"
        description="Monitor warehouse performance and operational trends."
      />

      {/* INVENTORY OVERVIEW */}
      <div className="analytics-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">
              INVENTORY OVERVIEW
            </span>
            <h2>Warehouse Inventory</h2>
          </div>
        </div>

        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-card-icon">
              <Package size={22} />
            </div>

            <div>
              <span>Total Products</span>
              <strong>{totalProducts}</strong>
            </div>
          </div>

          <div className="analytics-card">
            <div className="analytics-card-icon">
              <Package size={22} />
            </div>

            <div>
              <span>Total Stock</span>
              <strong>{totalStock}</strong>
            </div>
          </div>

          <div className="analytics-card">
            <div className="analytics-card-icon">
              <ShoppingCart size={22} />
            </div>

            <div>
              <span>Reserved Stock</span>
              <strong>{reservedStock}</strong>
            </div>
          </div>

          <div className="analytics-card">
            <div className="analytics-card-icon">
              <Truck size={22} />
            </div>

            <div>
              <span>Available Stock</span>
              <strong>{availableStock}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* STOCK HEALTH */}
      <div className="analytics-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">
              STOCK HEALTH
            </span>
            <h2>Inventory Risk</h2>
          </div>
        </div>

        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-card-icon">
              <TrendingUp size={22} />
            </div>

            <div>
              <span>Low Stock Products</span>
              <strong>{lowStockProducts}</strong>
            </div>
          </div>

          <div className="analytics-card">
            <div className="analytics-card-icon">
              <AlertTriangle size={22} />
            </div>

            <div>
              <span>Out of Stock</span>
              <strong>{outOfStockProducts}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ORDER OVERVIEW */}
      <div className="analytics-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">
              ORDER PERFORMANCE
            </span>
            <h2>Fulfillment Overview</h2>
          </div>
        </div>

        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-card-icon">
              <ShoppingCart size={22} />
            </div>

            <div>
              <span>Total Orders</span>
              <strong>{totalOrders}</strong>
            </div>
          </div>

          <div className="analytics-card">
            <div className="analytics-card-icon">
              <Package size={22} />
            </div>

            <div>
              <span>Completed Orders</span>
              <strong>{completedOrders}</strong>
            </div>
          </div>

          <div className="analytics-card">
            <div className="analytics-card-icon">
              <BarChart3 size={22} />
            </div>

            <div>
              <span>Fulfillment Rate</span>
              <strong>{fulfillmentRate}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ORDER STATUS */}
      <div className="analytics-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">
              ORDER STATUS
            </span>
            <h2>Orders by Status</h2>
          </div>
        </div>

        <div className="analytics-list">
          {Object.entries(byStatus).map(([status, count]) => (
            <div
              className="analytics-list-row"
              key={status}
            >
              <span>{status}</span>
              <strong>{count}</strong>
            </div>
          ))}

          {Object.keys(byStatus).length === 0 && (
            <div className="analytics-empty">
              No order status data available.
            </div>
          )}
        </div>
      </div>

      {/* ORDER PRIORITY */}
      <div className="analytics-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">
              ORDER PRIORITY
            </span>
            <h2>Orders by Priority</h2>
          </div>
        </div>

        <div className="analytics-list">
          {Object.entries(byPriority).map(
            ([priority, count]) => (
              <div
                className="analytics-list-row"
                key={priority}
              >
                <span>{priority}</span>
                <strong>{count}</strong>
              </div>
            )
          )}

          {Object.keys(byPriority).length === 0 && (
            <div className="analytics-empty">
              No priority data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;