import { useEffect, useState } from "react";
import {
  Truck,
  PackageCheck,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import ModuleHeader from "../components/ModuleHeader";

const API_URL = "http://127.0.0.1:8000";

function Fulfillment() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFulfillment = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/picking-packing/`
      );

      setOrders(response.data);
    } catch (err) {
      console.error("Fulfillment API error:", err);

      setError(
        "Unable to load fulfillment data from backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFulfillment();
  }, []);

  const totalOrders = orders.length;

  const allocatedOrders = orders.filter(
    (order) => (order.allocated || 0) > 0
  ).length;

  const pickedOrders = orders.filter(
    (order) => (order.picked || 0) > 0
  ).length;

  const packedOrders = orders.filter(
    (order) => (order.packed || 0) > 0
  ).length;

  const readyForDispatch = orders.filter(
    (order) =>
      order.status === "READY_TO_DISPATCH"
  ).length;

  const dispatched = orders.filter(
    (order) =>
      order.status === "DISPATCHED"
  ).length;

  const inTransit = orders.filter(
    (order) =>
      order.status === "IN_TRANSIT"
  ).length;

  const delivered = orders.filter(
    (order) =>
      order.status === "DELIVERED"
  ).length;

  const getFulfillmentStatus = (order) => {
    if (order.status === "DISPATCHED") {
      return "DISPATCHED";
    }

    if (order.status === "IN_TRANSIT") {
      return "IN_TRANSIT";
    }

    if (order.status === "DELIVERED") {
      return "DELIVERED";
    }

    if (order.status === "READY_TO_DISPATCH") {
      return "READY";
    }

    if (order.status === "READY_FOR_PACKING") {
      return "PACKING";
    }

    if (order.status === "PACKING") {
      return "PACKING";
    }

    if (order.status === "PICKING") {
      return "PICKING";
    }

    if (order.status === "READY_FOR_PICKING") {
      return "READY_FOR_PICKING";
    }

    if (order.status === "ALLOCATED") {
      return "ALLOCATED";
    }

    return "WAITING";
  };

  if (loading) {
    return (
      <div className="module-page">
        <ModuleHeader
          eyebrow="ORDER FULFILLMENT"
          title="Fulfillment"
          description="Track orders from allocation to final dispatch."
        />

        <div className="module-panel">
          <h2>Loading fulfillment data...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="module-page">
        <ModuleHeader
          eyebrow="ORDER FULFILLMENT"
          title="Fulfillment"
          description="Track orders from allocation to final dispatch."
        />

        <div className="module-panel">
          <h2>{error}</h2>

          <button
            className="module-action"
            onClick={loadFulfillment}
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
        eyebrow="ORDER FULFILLMENT"
        title="Fulfillment"
        description="Track orders from allocation to final dispatch."
      />

      {/* Statistics */}

      <div className="module-stats">

        <div className="module-stat">
          <Truck size={20} />
          <span>Ready to Dispatch</span>
          <strong>{readyForDispatch}</strong>
        </div>

        <div className="module-stat">
          <PackageCheck size={20} />
          <span>Dispatched</span>
          <strong>{dispatched}</strong>
        </div>

        <div className="module-stat">
          <Clock3 size={20} />
          <span>In Transit</span>
          <strong>{inTransit}</strong>
        </div>

        <div className="module-stat">
          <CheckCircle2 size={20} />
          <span>Delivered</span>
          <strong>{delivered}</strong>
        </div>

      </div>

      {/* Fulfillment Pipeline */}

      <div className="module-panel">

        <div className="module-panel-header">

          <div>
            <h2>Fulfillment Pipeline</h2>
            <p>
              Current order progression
            </p>
          </div>

          <button
            className="module-action"
            onClick={loadFulfillment}
          >
            Refresh Fulfillment
          </button>

        </div>

        <div className="fulfillment-flow">

          <div>
            <strong>{totalOrders}</strong>
            <span>Orders</span>
          </div>

          <div className="flow-line" />

          <div>
            <strong>{allocatedOrders}</strong>
            <span>Allocated</span>
          </div>

          <div className="flow-line" />

          <div>
            <strong>{pickedOrders}</strong>
            <span>Picked</span>
          </div>

          <div className="flow-line" />

          <div>
            <strong>{packedOrders}</strong>
            <span>Packed</span>
          </div>

          <div className="flow-line" />

          <div>
            <strong>{dispatched}</strong>
            <span>Dispatched</span>
          </div>

        </div>

      </div>

      {/* Order Fulfillment Monitor */}

      <div className="module-panel">

        <div className="module-panel-header">

          <div>
            <h2>Fulfillment Monitor</h2>
            <p>
              Live order fulfillment activity
            </p>
          </div>

          <span className="module-badge">
            LIVE
          </span>

        </div>

        {orders.length === 0 ? (

          <div style={{ padding: "30px" }}>
            <h3>No fulfillment records</h3>
            <p>
              There are currently no orders in the
              fulfillment pipeline.
            </p>
          </div>

        ) : (

          <div style={{ overflowX: "auto" }}>

            <table className="module-table">

              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>CUSTOMER</th>
                  <th>TOTAL ITEMS</th>
                  <th>ALLOCATED</th>
                  <th>PICKED</th>
                  <th>PACKED</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>

                {orders.map((order) => (

                  <tr
                    key={order.order_number}
                  >

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
                      {order.allocated}
                    </td>

                    <td>
                      {order.picked}
                    </td>

                    <td>
                      {order.packed}
                    </td>

                    <td>
                      <span className="module-badge">
                        {getFulfillmentStatus(order)}
                      </span>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* Fulfillment Summary */}

      <div className="module-panel">

        <div className="module-panel-header">

          <div>
            <h2>Fulfillment Summary</h2>
            <p>
              Current warehouse fulfillment performance
            </p>
          </div>

        </div>

        <div className="station-grid">

          <div className="station-card">
            <strong>Orders</strong>
            <span className="station-online">
              {totalOrders}
            </span>
            <p>
              Total orders in pipeline
            </p>
          </div>

          <div className="station-card">
            <strong>Allocated</strong>
            <span className="station-online">
              {allocatedOrders}
            </span>
            <p>
              Orders with inventory allocated
            </p>
          </div>

          <div className="station-card">
            <strong>Packed</strong>
            <span className="station-online">
              {packedOrders}
            </span>
            <p>
              Orders with packing activity
            </p>
          </div>

          <div className="station-card">
            <strong>Dispatch Ready</strong>
            <span className="station-idle">
              {readyForDispatch}
            </span>
            <p>
              Orders ready for dispatch
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Fulfillment;