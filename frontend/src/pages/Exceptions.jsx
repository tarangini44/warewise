import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Package,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import ModuleHeader from "../components/ModuleHeader";

import API_URL from "../config";

function Exceptions() {
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadExceptions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/api/exceptions/`
      );

      setExceptions(response.data.exceptions || []);
    } catch (err) {
      console.error("Exceptions API error:", err);

      setError(
        "Unable to load exception data from backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExceptions();
  }, []);

  const criticalCount = exceptions.filter(
    (item) => item.severity === "CRITICAL"
  ).length;

  const warningCount = exceptions.filter(
    (item) => item.severity === "WARNING"
  ).length;

  const inventoryCount = exceptions.filter(
    (item) => item.type === "INVENTORY"
  ).length;

  const allocationCount = exceptions.filter(
    (item) => item.type === "ORDER_ALLOCATION"
  ).length;

  const deadlineCount = exceptions.filter(
    (item) => item.type === "DEADLINE"
  ).length;

  const getReference = (item) => {
    if (item.order_number) {
      return item.order_number;
    }

    if (item.sku) {
      return item.sku;
    }

    return "-";
  };

  const getIssue = (item) => {
    if (item.type === "INVENTORY") {
      return "Inventory Exception";
    }

    if (item.type === "ORDER_ALLOCATION") {
      return "Order Allocation";
    }

    if (item.type === "DEADLINE") {
      return "Deadline Exception";
    }

    return item.type || "Operational Exception";
  };

  if (loading) {
    return (
      <div className="module-page">
        <ModuleHeader
          eyebrow="EXCEPTION MANAGEMENT"
          title="Exceptions"
          description="Identify, prioritize and resolve warehouse operational issues."
        />

        <div className="module-panel">
          <h2>Loading exceptions...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="module-page">
        <ModuleHeader
          eyebrow="EXCEPTION MANAGEMENT"
          title="Exceptions"
          description="Identify, prioritize and resolve warehouse operational issues."
        />

        <div className="module-panel">
          <h2>{error}</h2>

          <button
            className="module-action"
            onClick={loadExceptions}
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
        eyebrow="EXCEPTION MANAGEMENT"
        title="Exceptions"
        description="Identify, prioritize and resolve warehouse operational issues."
      />

      {/* Statistics */}

      <div className="module-stats">

        <div className="module-stat">
          <AlertTriangle size={20} />
          <span>Total Exceptions</span>
          <strong>{exceptions.length}</strong>
        </div>

        <div className="module-stat">
          <AlertTriangle size={20} />
          <span>Critical</span>
          <strong>{criticalCount}</strong>
        </div>

        <div className="module-stat">
          <Clock3 size={20} />
          <span>Warnings</span>
          <strong>{warningCount}</strong>
        </div>

        <div className="module-stat">
          <CheckCircle2 size={20} />
          <span>Inventory Issues</span>
          <strong>{inventoryCount}</strong>
        </div>

      </div>

      {/* Exception Queue */}

      <div className="module-panel">

        <div className="module-panel-header">

          <div>
            <h2>Exception Queue</h2>

            <p>
              Live warehouse issues requiring attention
            </p>
          </div>

          <button
            className="module-action"
            onClick={loadExceptions}
          >
            Refresh Exceptions
          </button>

        </div>

        {exceptions.length === 0 ? (

          <div style={{ padding: "30px" }}>
            <h3>No active exceptions</h3>

            <p>
              WareWise has detected no current
              operational exceptions.
            </p>
          </div>

        ) : (

          <div style={{ overflowX: "auto" }}>

            <table className="module-table">

              <thead>
                <tr>
                  <th>TYPE</th>
                  <th>REFERENCE</th>
                  <th>ISSUE</th>
                  <th>SEVERITY</th>
                  <th>MESSAGE</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>

                {exceptions.map((item, index) => (

                  <tr
                    key={`${item.type}-${getReference(item)}-${index}`}
                  >

                    <td>
                      <strong>
                        {item.type}
                      </strong>
                    </td>

                    <td>
                      {getReference(item)}
                    </td>

                    <td>
                      {getIssue(item)}
                    </td>

                    <td>

                      <span className="module-badge">
                        {item.severity}
                      </span>

                    </td>

                    <td>
                      {item.message}
                    </td>

                    <td>

                      <button
                        className="module-action"
                        onClick={() => {
                          alert(
                            `Review required: ${item.message}`
                          );
                        }}
                      >
                        Review
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* Exception Summary */}

      <div className="module-panel">

        <div className="module-panel-header">

          <div>
            <h2>Exception Analysis</h2>

            <p>
              Breakdown of current warehouse exceptions
            </p>
          </div>

          <span className="module-badge">
            LIVE DATA
          </span>

        </div>

        <div className="station-grid">

          <div className="station-card">
            <strong>Critical Issues</strong>

            <span className="station-idle">
              {criticalCount}
            </span>

            <p>
              Issues requiring immediate attention
            </p>
          </div>

          <div className="station-card">
            <strong>Inventory</strong>

            <span className="station-idle">
              {inventoryCount}
            </span>

            <p>
              Stock-related exceptions
            </p>
          </div>

          <div className="station-card">
            <strong>Allocation</strong>

            <span className="station-idle">
              {allocationCount}
            </span>

            <p>
              Orders with allocation problems
            </p>
          </div>

          <div className="station-card">
            <strong>Deadlines</strong>

            <span className="station-idle">
              {deadlineCount}
            </span>

            <p>
              Orders past their fulfillment deadline
            </p>
          </div>

        </div>

      </div>

      {/* Smart Recommendation */}

      <div className="recommendation-box">

        <Package size={21} />

        <div>

          <strong>
            Smart Exception Recommendation
          </strong>

          <p>
            Prioritize critical inventory and allocation
            exceptions first because they can directly
            delay customer order fulfillment.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Exceptions;
