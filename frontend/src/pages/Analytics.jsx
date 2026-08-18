import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart3,
  TrendingUp,
  Package,
  ShoppingCart,
  Truck,
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

      const response = await axios.get(
        `${API_URL}/api/analytics/`
      );

      setAnalytics(response.data);
    } catch (err) {
      console.error("Analytics API error:", err);
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
          <h2>{error || "No analytics data available."}</h2>

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

  const inventory = analytics.inventory;
  const orders = analytics.orders;

  const totalOrders = orders.total_orders || 0;

  const created = orders.by_status?.CREATED || 0;
  const allocated = orders.by_status?.ALLOCATED || 0;
  const picking = orders.by_status?.PICKING || 0;
  const packing = orders.by_status?.PACKING || 0;

  const performance = [
    {
      name: "Created",
      value: created,
    },
    {
      name: "Allocated",
      value: allocated,
    },
    {
      name: "Picking",
      value: picking,
    },
    {
      name: "Packing",
      value: packing,
    },
  ];

  const fulfillmentRate =
    orders.fulfillment_rate || 0;

  const inventoryHealth =
    inventory.total_products > 0
      ? (
          ((inventory.total_products -
            inventory.low_stock_products -
            inventory.out_of_stock_products) /
            inventory.total_products) *
          100
        ).toFixed(1)
      : 0;

  const totalStock = inventory.total_stock || 0;
  const availableStock = inventory.available_stock || 0;

  return (
    <div className="module-page">

      <ModuleHeader
        eyebrow="WAREHOUSE ANALYTICS"
        title="Analytics"
        description="Monitor warehouse performance and operational trends."
      />

      {/* Top metrics */}

      <div className="module-stats">

        <div className="module-stat">
          <TrendingUp size={20} />
          <span>Order Fulfillment</span>
          <strong>
            {fulfillmentRate.toFixed(1)}%
          </strong>

          <small className="analytics-change">
            LIVE
          </small>
        </div>

        <div className="module-stat">
          <Package size={20} />
          <span>Inventory Health</span>
          <strong>
            {inventoryHealth}%
          </strong>

          <small className="analytics-change">
            LIVE
          </small>
        </div>

        <div className="module-stat">
          <ShoppingCart size={20} />
          <span>Total Orders</span>
          <strong>
            {totalOrders}
          </strong>

          <small className="analytics-change">
            ACTIVE
          </small>
        </div>

        <div className="module-stat">
          <Truck size={20} />
          <span>Available Stock</span>
          <strong>
            {availableStock}
          </strong>

          <small className="analytics-change">
            UNITS
          </small>
        </div>

      </div>

      {/* Main analytics */}

      <div className="analytics-grid">

        {/* Fulfillment pipeline */}

        <div className="module-panel">

          <div className="module-panel-header">

            <div>
              <h2>Fulfillment Pipeline</h2>
              <p>
                Current order progression
              </p>
            </div>

            <BarChart3 size={22} />

          </div>

          <div className="analytics-bars">

            {performance.map((item) => {

              const percentage =
                totalOrders > 0
                  ? (item.value / totalOrders) * 100
                  : 0;

              return (
                <div
                  className="analytics-bar-row"
                  key={item.name}
                >

                  <div className="analytics-bar-label">

                    <span>
                      {item.name}
                    </span>

                    <strong>
                      {item.value}
                    </strong>

                  </div>

                  <div className="analytics-track">

                    <div
                      className="analytics-fill"
                      style={{
                        width: `${percentage}%`,
                      }}
                    ></div>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

        {/* Operational summary */}

        <div className="module-panel">

          <div className="module-panel-header">

            <div>
              <h2>
                Operational Summary
              </h2>

              <p>
                Live warehouse activity
              </p>
            </div>

          </div>

          <div className="analytics-summary">

            <div>
              <Package size={20} />

              <span>
                Total Stock
              </span>

              <strong>
                {totalStock}
              </strong>
            </div>

            <div>
              <Package size={20} />

              <span>
                Available Stock
              </span>

              <strong>
                {availableStock}
              </strong>
            </div>

            <div>
              <ShoppingCart size={20} />

              <span>
                Total Orders
              </span>

              <strong>
                {totalOrders}
              </strong>
            </div>

            <div>
              <Truck size={20} />

              <span>
                Completed Orders
              </span>

              <strong>
                {orders.completed_orders || 0}
              </strong>
            </div>

          </div>

        </div>

      </div>

      {/* Performance overview */}

      <div className="module-panel">

        <div className="module-panel-header">

          <div>
            <h2>
              Performance Overview
            </h2>

            <p>
              Key warehouse indicators
            </p>
          </div>

          <span className="module-badge">
            LIVE METRICS
          </span>

        </div>

        <table className="module-table">

          <thead>

            <tr>
              <th>METRIC</th>
              <th>CURRENT</th>
              <th>TARGET</th>
              <th>STATUS</th>
            </tr>

          </thead>

          <tbody>

            <tr>
              <td>
                Order Fulfillment
              </td>

              <td>
                {fulfillmentRate.toFixed(1)}%
              </td>

              <td>
                90%
              </td>

              <td>
                <span className="module-badge">
                  {fulfillmentRate >= 90
                    ? "Healthy"
                    : "Needs Attention"}
                </span>
              </td>
            </tr>

            <tr>
              <td>
                Inventory Health
              </td>

              <td>
                {inventoryHealth}%
              </td>

              <td>
                90%
              </td>

              <td>
                <span className="module-badge">
                  {Number(inventoryHealth) >= 90
                    ? "Healthy"
                    : "Needs Attention"}
                </span>
              </td>
            </tr>

            <tr>
              <td>
                Stock Availability
              </td>

              <td>
                {totalStock > 0
                  ? (
                      (availableStock /
                        totalStock) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </td>

              <td>
                80%
              </td>

              <td>
                <span className="module-badge">
                  {totalStock > 0 &&
                  (availableStock /
                    totalStock) *
                    100 >=
                    80
                    ? "Healthy"
                    : "Needs Attention"}
                </span>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* Priority breakdown */}

      <div className="module-panel">

        <div className="module-panel-header">

          <div>
            <h2>
              Order Priority Distribution
            </h2>

            <p>
              Current orders by priority
            </p>
          </div>

        </div>

        <div className="analytics-summary">

          <div>
            <span>
              Urgent
            </span>

            <strong>
              {orders.by_priority?.URGENT || 0}
            </strong>
          </div>

          <div>
            <span>
              High
            </span>

            <strong>
              {orders.by_priority?.HIGH || 0}
            </strong>
          </div>

          <div>
            <span>
              Normal
            </span>

            <strong>
              {orders.by_priority?.NORMAL || 0}
            </strong>
          </div>

          <div>
            <span>
              Low
            </span>

            <strong>
              {orders.by_priority?.LOW || 0}
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;
