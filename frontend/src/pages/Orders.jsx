import { useEffect, useState } from "react";
import axios from "axios";
import {
  ShoppingCart,
  Clock3,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import ModuleHeader from "../components/ModuleHeader";

const API_URL = "http://127.0.0.1:8000";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/orders/`
      );

      setOrders(response.data);
    } catch (err) {
      console.error("Orders API error:", err);
      setError("Unable to load orders from the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const activeOrders = orders.filter(
    (order) =>
      order.status !== "COMPLETED" &&
      order.status !== "DISPATCHED"
  ).length;

  const pendingOrders = orders.filter(
    (order) =>
      order.status === "CREATED"
  ).length;

  const completedOrders = orders.filter(
    (order) =>
      order.status === "COMPLETED" ||
      order.status === "DISPATCHED"
  ).length;

  const priorityOrders = orders.filter(
    (order) =>
      order.priority === "URGENT" ||
      order.priority === "HIGH"
  ).length;

  const formatDeadline = (deadline) => {
    if (!deadline) {
      return "No deadline";
    }

    const date = new Date(deadline);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="module-page">
        <ModuleHeader
          eyebrow="ORDER MANAGEMENT"
          title="Orders"
          description="Track orders through the complete warehouse fulfillment lifecycle."
        />

        <div className="module-panel">
          <h2>Loading orders...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="module-page">
        <ModuleHeader
          eyebrow="ORDER MANAGEMENT"
          title="Orders"
          description="Track orders through the complete warehouse fulfillment lifecycle."
        />

        <div className="module-panel">
          <h2>{error}</h2>

          <button
            className="module-action"
            onClick={loadOrders}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="module-page">

      <ModuleHeader
        eyebrow="ORDER MANAGEMENT"
        title="Orders"
        description="Track orders through the complete warehouse fulfillment lifecycle."
      />

      {/* Statistics */}

      <div className="module-stats">

        <div className="module-stat">
          <ShoppingCart size={20} />
          <span>Active Orders</span>
          <strong>{activeOrders}</strong>
        </div>

        <div className="module-stat">
          <Clock3 size={20} />
          <span>Pending</span>
          <strong>{pendingOrders}</strong>
        </div>

        <div className="module-stat">
          <CheckCircle2 size={20} />
          <span>Completed Today</span>
          <strong>{completedOrders}</strong>
        </div>

        <div className="module-stat">
          <AlertTriangle size={20} />
          <span>Priority Orders</span>
          <strong>{priorityOrders}</strong>
        </div>

      </div>

      {/* Orders table */}

      <div className="module-panel">

        <div className="module-panel-header">

          <div>
            <h2>Active Orders</h2>

            <p>
              Orders currently moving through fulfillment
            </p>
          </div>

          <button
            className="module-action"
            onClick={loadOrders}
          >
            Refresh Orders
          </button>

        </div>

        {orders.length === 0 ? (

          <div style={{ padding: "30px" }}>
            <h3>No orders found</h3>
            <p>
              There are currently no orders in the warehouse.
            </p>
          </div>

        ) : (

          <div style={{ overflowX: "auto" }}>

            <table className="module-table">

              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>CUSTOMER</th>
                  <th>ITEMS</th>
                  <th>PRIORITY</th>
                  <th>STATUS</th>
                  <th>DEADLINE</th>
                </tr>
              </thead>

              <tbody>

                {orders.map((order) => (

                  <tr key={order.order_number}>

                    <td>
                      <strong>
                        {order.order_number}
                      </strong>
                    </td>

                    <td>
                      {order.customer}
                    </td>

                    <td>
                      {order.total_items}
                    </td>

                    <td>

                      <span
                        className={`order-badge ${
                          order.priority.toLowerCase()
                        }`}
                      >
                        {order.priority}
                      </span>

                    </td>

                    <td>

                      <span className="module-badge">
                        {order.status}
                      </span>

                    </td>

                    <td>

                      <span className="order-deadline">

                        <Clock3 size={13} />

                        {formatDeadline(
                          order.deadline
                        )}

                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Orders;