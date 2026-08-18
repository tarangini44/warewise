import { useEffect, useState } from "react";
import axios from "axios";
import {
  ClipboardList,
  PackageCheck,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import ModuleHeader from "../components/ModuleHeader";

const API_URL = "http://127.0.0.1:8000";

function PickingPacking() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPickingPacking = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/picking-packing/`
      );

      setOrders(response.data);
    } catch (err) {
      console.error("Picking & Packing API error:", err);
      setError(
        "Unable to load picking and packing data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPickingPacking();
  }, []);

  const pickingQueue = orders.filter(
    (order) =>
      order.status === "READY_FOR_PICKING" ||
      order.status === "PICKING"
  ).length;

  const readyForPacking = orders.filter(
    (order) =>
      order.status === "READY_FOR_PACKING"
  ).length;

  const inProgress = orders.filter(
    (order) =>
      order.status === "PICKING" ||
      order.status === "PACKING"
  ).length;

  const completed = orders.filter(
    (order) =>
      order.status === "COMPLETED" ||
      order.status === "READY_TO_DISPATCH"
  ).length;

  const getProgress = (order) => {
    if (!order.total_items || order.total_items === 0) {
      return 0;
    }

    const completedItems =
      (order.picked || 0) +
      (order.packed || 0);

    return Math.min(
      100,
      Math.round(
        (completedItems / order.total_items) * 100
      )
    );
  };

  if (loading) {
    return (
      <div className="module-page">
        <ModuleHeader
          eyebrow="WAREHOUSE OPERATIONS"
          title="Picking & Packing"
          description="Manage picking tasks and prepare completed orders for dispatch."
        />

        <div className="module-panel">
          <h2>Loading warehouse tasks...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="module-page">
        <ModuleHeader
          eyebrow="WAREHOUSE OPERATIONS"
          title="Picking & Packing"
          description="Manage picking tasks and prepare completed orders for dispatch."
        />

        <div className="module-panel">
          <h2>{error}</h2>

          <button
            className="module-action"
            onClick={loadPickingPacking}
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
        eyebrow="WAREHOUSE OPERATIONS"
        title="Picking & Packing"
        description="Manage picking tasks and prepare completed orders for dispatch."
      />

      {/* Statistics */}

      <div className="module-stats">

        <div className="module-stat">
          <ClipboardList size={20} />
          <span>Picking Queue</span>
          <strong>{pickingQueue}</strong>
        </div>

        <div className="module-stat">
          <PackageCheck size={20} />
          <span>Ready for Packing</span>
          <strong>{readyForPacking}</strong>
        </div>

        <div className="module-stat">
          <Clock3 size={20} />
          <span>In Progress</span>
          <strong>{inProgress}</strong>
        </div>

        <div className="module-stat">
          <CheckCircle2 size={20} />
          <span>Completed</span>
          <strong>{completed}</strong>
        </div>

      </div>

      {/* Picking & Packing Queue */}

      <div className="module-panel">

        <div className="module-panel-header">

          <div>
            <h2>
              Picking & Packing Queue
            </h2>

            <p>
              Live warehouse task progress
            </p>
          </div>

          <button
            className="module-action"
            onClick={loadPickingPacking}
          >
            Refresh Tasks
          </button>

        </div>

        {orders.length === 0 ? (

          <div style={{ padding: "30px" }}>
            <h3>No active warehouse tasks</h3>
            <p>
              There are currently no picking or packing tasks.
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
                  <th>PROGRESS</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>

                {orders.map((order) => {

                  const progress =
                    getProgress(order);

                  return (

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

                        <div className="task-progress">

                          <div className="task-progress-track">

                            <div
                              className="task-progress-fill"
                              style={{
                                width: `${progress}%`,
                              }}
                            />

                          </div>

                          <span>
                            {progress}%
                          </span>

                        </div>

                      </td>

                      <td>

                        <span className="module-badge">
                          {order.status}
                        </span>

                      </td>

                    </tr>

                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* Workflow information */}

      <div className="module-panel">

        <div className="module-panel-header">

          <div>
            <h2>
              Warehouse Workflow
            </h2>

            <p>
              Current order movement through picking
              and packing
            </p>
          </div>

        </div>

        <div className="station-grid">

          <div className="station-card">
            <strong>Waiting Allocation</strong>

            <span className="station-idle">
              {orders.filter(
                (order) =>
                  order.status ===
                  "WAITING_ALLOCATION"
              ).length}
            </span>

            <p>
              Orders waiting for stock allocation
            </p>
          </div>

          <div className="station-card">
            <strong>Ready for Picking</strong>

            <span className="station-online">
              {orders.filter(
                (order) =>
                  order.status ===
                  "READY_FOR_PICKING"
              ).length}
            </span>

            <p>
              Orders ready for warehouse picking
            </p>
          </div>

          <div className="station-card">
            <strong>Picking</strong>

            <span className="station-online">
              {orders.filter(
                (order) =>
                  order.status === "PICKING"
              ).length}
            </span>

            <p>
              Orders currently being picked
            </p>
          </div>

          <div className="station-card">
            <strong>Ready for Packing</strong>

            <span className="station-online">
              {orders.filter(
                (order) =>
                  order.status ===
                  "READY_FOR_PACKING"
              ).length}
            </span>

            <p>
              Orders ready for packing
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default PickingPacking;